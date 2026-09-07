import { useEffect, useRef, useState } from "react";
import { cities } from "../cities/packs";
import type { Building, Locale } from "../cities/types";
import { move, undo, type Direction, type Movement } from "./engine";
import { freshCity, type Save } from "./storage";
import { nextWeather, randomWeather } from "./weather";
import type { GameRepository } from "./repository";
import { messages } from "../i18n";
import { keyboardDirection, normalizeRotation } from "./boardRotation";
const EMPTY_EVENTS: Movement[] = [];
/**
 * Undoing the last move is disabled for now. The engine still records the
 * snapshot (saves stay compatible), only the controls are hidden.
 */
export const UNDO_ENABLED: boolean = false;
export type GameModalState = "help" | "restart" | "history" | Building | null;
/**
 * Game state shared by every layout (desktop page, mobile pages). Layout-specific
 * UI state such as the active page stays in the layout component so a viewport
 * change never loses the run, an open dialog, or the pending animation.
 */
export function useGame(initial: Save, repository: GameRepository) {
  const [save, setSave] = useState(initial),
    [modal, setModal] = useState<GameModalState>(null),
    [events, setEvents] = useState<Movement[]>(EMPTY_EVENTS);
  const [stored, setStored] = useState<boolean | null>(null),
    [announcement, setAnnouncement] = useState(""),
    [reduced, setReduced] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  const busyUntil = useRef(0),
    latest = useRef(save);
  latest.current = save;
  const city = cities.find((c) => c.id === save.city)!,
    current = save.cities[city.id],
    locale = save.locale,
    t = messages[locale],
    showLabels = save.showLabels ?? false,
    boardRotationStep = save.boardRotationStep ?? 0,
    weather = save.weather ?? "clear";
  const highest = Math.max(...current.discovered),
    highestIndex = Math.max(
      0,
      city.buildings.findIndex((b) => b.value === highest),
    );
  const next = city.buildings.find((b) => b.value > highest);
  useEffect(() => {
    let active = true;
    setStored(null);
    repository
      .save(save)
      .then(() => {
        if (active) setStored(true);
      })
      .catch(() => {
        if (active) setStored(false);
      });
    document.documentElement.lang = save.locale;
    return () => {
      active = false;
    };
  }, [save, repository]);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setReduced(query.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  useEffect(() => {
    if (weather === "off") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      timer = setTimeout(
        () => {
          setEvents(EMPTY_EVENTS);
          setSave((prev) => ({
            ...prev,
            weather: randomWeather(prev.weather ?? "clear"),
          }));
          schedule();
        },
        45_000 + Math.random() * 45_000,
      );
    };
    schedule();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [weather === "off"]);
  function changeCity(id: string) {
    busyUntil.current = 0;
    setEvents(EMPTY_EVENTS);
    setAnnouncement("");
    setSave((prev) => ({
      ...prev,
      city: id,
      cities: { ...prev.cities, [id]: prev.cities[id] ?? freshCity() },
    }));
  }
  function setLocale(next: Locale) {
    setSave((prev) => ({ ...prev, locale: next }));
  }
  function toggleLabels() {
    // Re-rendering the board replays pending events, so drop them first.
    setEvents(EMPTY_EVENTS);
    setSave((prev) => ({ ...prev, showLabels: !(prev.showLabels ?? false) }));
  }
  function rotateBoard(delta: -1 | 1) {
    // View-only: preserve events so an in-flight merge can finish normally.
    setSave((prev) => ({
      ...prev,
      boardRotationStep: normalizeRotation(
        (prev.boardRotationStep ?? 0) + delta,
      ),
    }));
  }
  function cycleWeather() {
    // Re-rendering the board replays pending events, so drop them first.
    setEvents(EMPTY_EVENTS);
    setSave((prev) => ({
      ...prev,
      weather: nextWeather(prev.weather ?? "clear"),
    }));
  }
  function play(direction: Direction) {
    if (modal || performance.now() < busyUntil.current) return;
    const before = latest.current,
      entry = before.cities[before.city],
      result = move(entry.run, direction);
    if (!result.changed) {
      setAnnouncement(t.noMove);
      return;
    }
    busyUntil.current = performance.now() + (reduced ? 0 : 325);
    setEvents(result.events);
    const discoveries = result.run.board.filter(
      (v) => v && !entry.discovered.includes(v),
    );
    const updated = {
      ...before,
      cities: {
        ...before.cities,
        [before.city]: {
          run: result.run,
          session: {
            ...entry.session,
            moves: entry.session.moves + 1,
            undoMoves: entry.session.moves,
          },
          best: Math.max(entry.best, result.run.score),
          discovered: [
            ...new Set([
              ...entry.discovered,
              ...result.run.board.filter(Boolean),
            ]),
          ],
        },
      },
    };
    latest.current = updated;
    setSave(updated);
    setAnnouncement(
      discoveries.length
        ? `${t.newDiscovery}: ${city.buildings.find((b) => b.value === Math.max(...discoveries))?.name[locale]}`
        : `${t.moved}. ${t.score}: ${result.run.score}`,
    );
  }
  /** Open a building's atlas card, e.g. from tapping its model on the board. */
  function inspect(value: number) {
    const building = city.buildings.find((b) => b.value === value);
    if (building) setModal(building);
  }
  function doUndo() {
    busyUntil.current = 0;
    setEvents(EMPTY_EVENTS);
    setSave((prev) => ({
      ...prev,
      cities: {
        ...prev.cities,
        [prev.city]: {
          ...prev.cities[prev.city],
          run: undo(prev.cities[prev.city].run),
          session: {
            ...prev.cities[prev.city].session,
            moves:
              prev.cities[prev.city].session.undoMoves ??
              prev.cities[prev.city].session.moves,
            undoMoves: null,
          },
        },
      },
    }));
    setAnnouncement(t.undo);
  }
  function restart() {
    busyUntil.current = 0;
    setEvents(EMPTY_EVENTS);
    setSave((prev) => {
      const fresh = freshCity(),
        old = prev.cities[prev.city];
      return {
        ...prev,
        cities: {
          ...prev.cities,
          [prev.city]: {
            ...fresh,
            best: old.best,
            discovered: [...new Set([...old.discovered, ...fresh.discovered])],
          },
        },
      };
    });
    setModal(null);
    setAnnouncement("");
  }
  return {
    save,
    city,
    current,
    locale,
    t,
    highest,
    highestIndex,
    next,
    modal,
    setModal,
    events,
    stored,
    announcement,
    reduced,
    setReduced,
    showLabels,
    toggleLabels,
    boardRotationStep,
    rotateBoard,
    weather,
    cycleWeather,
    changeCity,
    setLocale,
    play,
    inspect,
    doUndo,
    restart,
  };
}
export type GameController = ReturnType<typeof useGame>;
/** Arrow / WASD moves. `enabled` is false while another page or a dialog is open. */
export function useArrowKeys(
  enabled: boolean,
  play: (d: Direction) => void,
  rotationStep = 0,
) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inCitySwitch = Boolean(target?.closest(".city-switch"));
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        target?.closest(
          'select,input,textarea,dialog,[contenteditable="true"]',
        ) ||
        (inCitySwitch &&
          ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key))
      )
        return;
      const dirs: Record<string, Direction> = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
      };
      // `code` keeps WASD usable when an IME or non-Latin keyboard layout
      // changes the character reported by `key`.
      const direction =
        dirs[e.key] ??
        (
          {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            KeyW: "up",
            KeyA: "left",
            KeyS: "down",
            KeyD: "right",
          } as Record<string, Direction>
        )[e.code];
      if (direction && enabled) {
        e.preventDefault();
        play(keyboardDirection(direction, rotationStep));
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
}
