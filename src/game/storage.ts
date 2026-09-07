import {
  getStatus,
  isTileValue,
  newRun,
  VALUES,
  type Run,
  type Snapshot,
} from "./engine";
import type { Locale } from "../cities/types";
import { readWeather, type Weather } from "./weather";
export const SAVE_KEY = "citymaker:v1";
export interface Session {
  id: string;
  startedAt: number;
  moves: number;
  undoMoves: number | null;
}
/**
 * `crypto.randomUUID` exists only in a secure context, so a page served over
 * plain HTTP — a phone opening the dev server across the LAN, or a self-hosted
 * deployment without TLS — used to throw here before the first save could even
 * be read, leaving the loading screen up forever. `getRandomValues` has no such
 * restriction and is more than enough for an id that only has to be unique
 * inside one browser profile.
 */
export function sessionId(): string {
  const source: Partial<Crypto> | undefined = globalThis.crypto;
  if (typeof source?.randomUUID === "function") return source.randomUUID();
  if (typeof source?.getRandomValues === "function") {
    const bytes = source.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Last resort: still unique enough to key one device's own history.
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`;
}
export const newSession = (): Session => ({
  id: sessionId(),
  startedAt: Date.now(),
  moves: 0,
  undoMoves: null,
});
export interface CitySave {
  session: Session;
  run: Run;
  best: number;
  discovered: number[];
}
export interface Save {
  version: 1;
  locale: Locale;
  city: string;
  cities: Record<string, CitySave>;
  /** Number badges on board tiles. Absent means off. */
  showLabels?: boolean;
  /** Diorama weather. Absent means clear. */
  weather?: Weather;
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const freshCity = (): CitySave => {
  const run = newRun();
  return {
    session: newSession(),
    run,
    best: 0,
    discovered: [...new Set(run.board.filter(Boolean))],
  };
};
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const scoreValid = (v: unknown): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
function snapshot(v: unknown): v is Snapshot {
  return (
    record(v) &&
    Array.isArray(v.board) &&
    v.board.length === 16 &&
    v.board.filter(Boolean).length >= 2 &&
    v.board.every((x) => x === 0 || isTileValue(x)) &&
    scoreValid(v.score)
  );
}
export function readSave(
  storage: StorageLike | undefined,
  ids: string[],
  defaultLocale: Locale = "en",
): Save {
  const base: Save = {
    version: 1,
    locale: defaultLocale,
    city: ids[0],
    cities: {},
  };
  try {
    const data: unknown = JSON.parse(storage?.getItem(SAVE_KEY) ?? "null");
    if (!record(data) || data.version !== 1) return base;
    if (["en", "zh-CN", "zh-HK"].includes(String(data.locale)))
      base.locale = data.locale as Locale;
    if (typeof data.showLabels === "boolean") base.showLabels = data.showLabels;
    if (typeof data.city === "string" && ids.includes(data.city))
      base.city = data.city;
    const weather = readWeather(data.weather, base.city);
    if (weather) base.weather = weather;
    if (record(data.cities))
      for (const id of ids) {
        const value = data.cities[id];
        if (!record(value) || !snapshot(value.run)) continue;
        const rawRun = value.run as Snapshot & {
          undo?: unknown;
          hasWon?: unknown;
          continued?: unknown;
        };
        const hasWon =
          rawRun.hasWon === true || rawRun.board.some((v) => v >= 2048);
        const continued = hasWon && rawRun.continued === true;
        const run: Run = {
          ...(hasWon ? { hasWon: true } : {}),
          ...(continued ? { continued: true } : {}),
          board: [...rawRun.board],
          score: rawRun.score,
          status: getStatus(rawRun.board, continued, hasWon),
          undo: snapshot(rawRun.undo) ? rawRun.undo : null,
        };
        const discovered = Array.isArray(value.discovered)
          ? value.discovered.filter((v) => VALUES.includes(v))
          : [];
        base.cities[id] = {
          run,
          session:
            record(value.session) &&
            typeof value.session.id === "string" &&
            value.session.id.length > 0 &&
            scoreValid(value.session.startedAt) &&
            scoreValid(value.session.moves)
              ? {
                  id: value.session.id,
                  startedAt: value.session.startedAt,
                  moves: value.session.moves,
                  undoMoves:
                    run.undo && scoreValid(value.session.undoMoves)
                      ? value.session.undoMoves
                      : null,
                }
              : newSession(),
          best: Math.max(run.score, scoreValid(value.best) ? value.best : 0),
          discovered: [
            ...new Set([
              ...discovered,
              ...run.board.filter(Boolean).map((v) => Math.min(v, 2048)),
            ]),
          ],
        };
      }
  } catch {
    /* Malformed or inaccessible storage must not prevent play. */
  }
  return base;
}
export function writeSave(
  storage: StorageLike | undefined,
  save: Save,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}
export function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
