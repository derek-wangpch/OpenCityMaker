import { cities } from "../cities/packs";
import {
  getStatus,
  move,
  newRun,
  undo,
  VALUES,
  type Direction,
  type Run,
} from "../game/engine";
import { nextWeather, readWeather, type Weather } from "../game/weather";

export const STORAGE_KEY = "citymaker:wechat:prototype:v1";
export const CITY_IDS = cities.map((city) => city.id);
export interface Progress {
  run: Run;
  best: number;
}
export interface State {
  version: 1;
  city: number;
  progress: Progress[];
  /** Diorama weather. Absent means clear. */
  weather?: Weather;
}
export interface Storage {
  getStorageSync(key: string): unknown;
  setStorageSync(key: string, value: unknown): void;
}
const fresh = (): Progress => ({ run: newRun(), best: 0 });
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object";
const score = (v: unknown): v is number =>
  Number.isSafeInteger(v) && Number(v) >= 0;
function snapshot(v: unknown): v is { board: number[]; score: number } {
  return (
    record(v) &&
    score(v.score) &&
    Array.isArray(v.board) &&
    v.board.length === 16 &&
    v.board.filter(Boolean).length >= 2 &&
    v.board.every((x) => x === 0 || VALUES.includes(x))
  );
}
export class Game {
  state: State = { version: 1, city: 0, progress: CITY_IDS.map(fresh) };
  notice = "";
  private writable = true;
  constructor(private storage: Storage) {
    try {
      const raw = storage.getStorageSync(STORAGE_KEY);
      if (!raw) return;
      if (!record(raw) || raw.version !== 1 || !Array.isArray(raw.progress)) {
        this.writable = false;
        this.notice = "存档版本无法读取，临时游玩（原存档保留）";
        return;
      }
      this.state.city =
        Number.isInteger(raw.city) &&
        Number(raw.city) >= 0 &&
        Number(raw.city) < CITY_IDS.length
          ? Number(raw.city)
          : 0;
      const weather = readWeather(raw.weather, CITY_IDS[this.state.city]);
      if (weather) this.state.weather = weather;
      this.state.progress = CITY_IDS.map((_, i) => {
        const p: unknown = (raw.progress as unknown[])[i];
        if (!record(p) || !snapshot(p.run)) return fresh();
        const r = p.run as typeof p.run & { undo?: unknown };
        return {
          best: Math.max(score(p.best) ? p.best : 0, r.score),
          run: {
            board: [...r.board],
            score: r.score,
            status: getStatus(r.board),
            undo: snapshot(r.undo)
              ? { board: [...r.undo.board], score: r.undo.score }
              : null,
          },
        };
      });
    } catch {
      this.writable = false;
      this.notice = "读取存档失败，临时游玩（原存档保留）";
    }
  }
  get current() {
    return this.state.progress[this.state.city];
  }
  save() {
    if (!this.writable) return;
    try {
      this.storage.setStorageSync(STORAGE_KEY, this.state);
      this.notice = "已保存在本机";
    } catch {
      this.notice = "保存失败，请勿退出；下次操作会重试";
    }
  }
  move(direction: Direction) {
    const result = move(this.current.run, direction);
    if (!result.changed) return;
    this.current.run = result.run;
    this.current.best = Math.max(this.current.best, result.run.score);
    this.save();
  }
  undo() {
    this.current.run = undo(this.current.run);
    this.save();
  }
  restart() {
    this.current.run = newRun();
    this.save();
  }
  nextCity() {
    this.state.city = (this.state.city + 1) % CITY_IDS.length;
    this.state.weather = readWeather(
      this.state.weather,
      CITY_IDS[this.state.city],
    );
    this.save();
  }
  cycleWeather() {
    this.state.weather = nextWeather(
      this.state.weather ?? "clear",
      CITY_IDS[this.state.city],
    );
    this.save();
  }
}
