import {
  readSave,
  SAVE_KEY,
  type Save,
  type StorageLike,
  type CitySave,
} from "./storage";
import type { Locale } from "../cities/types";
export const DB_NAME = "citymaker";
export interface BattleRecord {
  id: string;
  city: string;
  startedAt: number;
  endedAt: number | null;
  outcome: "playing" | "won" | "lost" | "restarted";
  score: number;
  highest: number;
  moves: number;
  board: number[];
}
/** Platform boundary: the web implementation is IndexedDB; a mini-game can implement this with wx storage. */
export interface GameRepository {
  load(): Promise<Save>;
  save(save: Save): Promise<void>;
  history(): Promise<BattleRecord[]>;
  close(): void;
}
function decode(value: unknown, ids: string[], defaultLocale: Locale): Save {
  return readSave(
    { getItem: () => JSON.stringify(value), setItem: () => {} },
    ids,
    defaultLocale,
  );
}
function battle(city: string, value: CitySave, now: number): BattleRecord {
  return {
    id: value.session.id,
    city,
    startedAt: value.session.startedAt,
    endedAt: value.run.status === "playing" ? null : now,
    outcome: value.run.status,
    score: value.run.score,
    highest: Math.max(...value.run.board),
    moves: value.session.moves,
    board: [...value.run.board],
  };
}
export class IndexedDbRepository implements GameRepository {
  private connection?: Promise<IDBDatabase>;
  private queue: Promise<void> = Promise.resolve();
  constructor(
    private ids: string[],
    private factory: IDBFactory | undefined,
    private legacy?: StorageLike,
    private name = DB_NAME,
    private defaultLocale: Locale = "en",
  ) {}
  private open(): Promise<IDBDatabase> {
    if (this.connection) return this.connection;
    const pending = new Promise<IDBDatabase>((resolve, reject) => {
      if (!this.factory) {
        reject(new Error("IndexedDB unavailable"));
        return;
      }
      const request = this.factory.open(this.name, 1);
      let failed = false;
      const fail = (reason: unknown) => {
        failed = true;
        clearTimeout(timer);
        reject(reason);
      };
      const timer = setTimeout(
        () => fail(new Error("IndexedDB open timed out")),
        5000,
      );
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore("progress");
        const runs = db.createObjectStore("battles", { keyPath: "id" });
        runs.createIndex("endedAt", "endedAt");
        runs.createIndex("city", "city");
      };
      request.onblocked = () => fail(new Error("IndexedDB upgrade blocked"));
      request.onerror = () => fail(request.error);
      request.onsuccess = () => {
        clearTimeout(timer);
        if (failed) {
          request.result.close();
          return;
        }
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          this.connection = undefined;
        };
        resolve(db);
      };
    });
    this.connection = pending;
    pending.catch(() => {
      if (this.connection === pending) this.connection = undefined;
    });
    return pending;
  }
  async load(): Promise<Save> {
    const db = await this.open();
    // Migration and marker are one transaction. The old key remains an untouched backup.
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["progress", "battles"], "readwrite");
      const store = tx.objectStore("progress");
      let loaded: Save;
      const request = store.get("current");
      request.onsuccess = () => {
        loaded =
          request.result === undefined
            ? readSave(this.legacy, this.ids, this.defaultLocale)
            : decode(request.result, this.ids, this.defaultLocale);
        if (request.result === undefined) {
          store.put(loaded, "current");
          store.put({ source: SAVE_KEY, at: Date.now() }, "migration");
        }
      };
      tx.oncomplete = () => resolve(loaded);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("Load aborted"));
    });
  }
  save(save: Save): Promise<void> {
    // Snapshots are queued in order; an older async commit cannot overwrite a newer one.
    const snapshot = structuredClone(save);
    const operation = this.queue
      .catch(() => {})
      .then(() => this.commit(snapshot));
    this.queue = operation;
    return operation;
  }
  private async commit(save: Save): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["progress", "battles"], "readwrite"),
        progress = tx.objectStore("progress"),
        runs = tx.objectStore("battles");
      const request = progress.get("current"),
        now = Date.now();
      request.onsuccess = () => {
        const previous =
          request.result === undefined
            ? undefined
            : decode(request.result, this.ids, this.defaultLocale);
        for (const [city, entry] of Object.entries(save.cities)) {
          const old = previous?.cities[city];
          if (old && old.session.id !== entry.session.id) {
            const record = battle(city, old, now);
            if (record.outcome === "playing") {
              record.outcome = "restarted";
              record.endedAt = now;
            }
            // Untouched fresh boards are not battles; imported played boards still count.
            if (
              old.session.moves > 0 ||
              old.run.score > 0 ||
              old.run.status !== "playing"
            ) {
              const existing = runs.get(record.id);
              existing.onsuccess = () =>
                runs.put(existing.result?.endedAt ? existing.result : record);
            }
          }
          const record = battle(city, entry, now);
          const existing = runs.get(record.id);
          existing.onsuccess = () => {
            if (
              record.outcome !== "playing" &&
              existing.result?.outcome === record.outcome
            )
              record.endedAt = existing.result.endedAt;
            runs.put(record);
          };
        }
        progress.put(save, "current");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("Save aborted"));
    });
  }
  async history(): Promise<BattleRecord[]> {
    await this.queue;
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("battles", "readonly"),
        request = tx.objectStore("battles").getAll();
      request.onsuccess = () =>
        resolve(
          (request.result as BattleRecord[])
            .filter((r) => r.outcome !== "playing")
            .sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0)),
        );
      request.onerror = () => reject(request.error);
    });
  }
  close() {
    this.connection?.then((db) => db.close()).catch(() => {});
    this.connection = undefined;
  }
}
export function browserDatabase(): IDBFactory | undefined {
  try {
    return window.indexedDB;
  } catch {
    return undefined;
  }
}
