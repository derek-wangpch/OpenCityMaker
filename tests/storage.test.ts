import { describe, it, expect } from "vitest";
import {
  SAVE_KEY,
  freshCity,
  readSave,
  writeSave,
  type Save,
  type StorageLike,
} from "../src/game/storage";
import { move } from "../src/game/engine";
const ids = ["beijing", "hongkong"];
function memory(raw: string | null = null): StorageLike {
  let value = raw;
  return {
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  };
}
describe("local persistence", () => {
  it("round-trips city runs, undo, discoveries, locale and best independently", () => {
    const beijing = freshCity();
    beijing.run = move(beijing.run, "right", () => 0).run;
    beijing.best = 200;
    beijing.discovered = [
      ...new Set([...beijing.discovered, ...beijing.run.board.filter(Boolean)]),
    ];
    const save: Save = {
      version: 1,
      city: "hongkong",
      locale: "zh-HK",
      cities: { beijing, hongkong: freshCity() },
    };
    const storage = memory();
    expect(writeSave(storage, save)).toBe(true);
    expect(readSave(storage, ids)).toEqual(save);
  });
  it("adds a city to the roster without migrating or disturbing existing saves", () => {
    const beijing = freshCity();
    beijing.best = 640;
    const save: Save = {
      version: 1,
      city: "beijing",
      locale: "en",
      cities: { beijing, hongkong: freshCity() },
    };
    const storage = memory();
    writeSave(storage, save);
    const grown = readSave(storage, [...ids, "shanghai"]);
    // The new city is simply absent until it is first played.
    expect(grown.cities.shanghai).toBeUndefined();
    expect(grown.cities.beijing.best).toBe(640);
    expect(grown.city).toBe("beijing");
  });
  it("recovers from malformed, unsupported, corrupt and blocked storage", () => {
    for (const raw of [
      "{",
      "null",
      "[]",
      '{"version":99}',
      '{"version":1,"cities":{"beijing":{"run":{"board":[2],"score":4}}}}',
    ])
      expect(readSave(memory(raw), ids).cities).toEqual({});
    const denied = {
      getItem: () => {
        throw Error();
      },
      setItem: () => {
        throw Error();
      },
    };
    expect(readSave(denied, ids).city).toBe("beijing");
    expect(writeSave(denied, readSave(undefined, ids))).toBe(false);
    expect(writeSave(undefined, readSave(undefined, ids))).toBe(false);
  });
  it("recomputes status, filters discoveries and ignores invalid undo", () => {
    const city = freshCity();
    const data = {
      version: 1,
      city: "missing",
      locale: "bad",
      cities: {
        beijing: {
          ...city,
          run: { ...city.run, status: "won", undo: { board: [], score: -1 } },
          discovered: [2, 3, 8192],
          best: -1,
        },
      },
    };
    const restored = readSave(memory(JSON.stringify(data)), ids);
    expect(restored.city).toBe("beijing");
    expect(restored.locale).toBe("en");
    expect(restored.cities.beijing.run.status).toBe("playing");
    expect(restored.cities.beijing.run.undo).toBe(null);
    expect(restored.cities.beijing.discovered).not.toContain(3);
  });
  it("rejects impossible board values and non-finite scores", () => {
    const city = freshCity();
    city.run.board[0] = 3;
    expect(
      readSave(
        memory(JSON.stringify({ version: 1, cities: { beijing: city } })),
        ids,
      ).cities,
    ).toEqual({});
    expect(SAVE_KEY).toBe("citymaker:v1");
  });
  it("remembers the tile-number preference only when it is a boolean", () => {
    const save: Save = {
      version: 1,
      city: "beijing",
      locale: "en",
      cities: { beijing: freshCity() },
      showLabels: true,
    };
    const storage = memory();
    writeSave(storage, save);
    expect(readSave(storage, ids)).toEqual(save);
    expect(readSave(storage, ids).showLabels).toBe(true);
    expect(
      readSave(memory(JSON.stringify({ ...save, showLabels: false })), ids)
        .showLabels,
    ).toBe(false);
    expect(
      readSave(memory(JSON.stringify({ ...save, showLabels: "yes" })), ids)
        .showLabels,
    ).toBeUndefined();
    const { showLabels: _omit, ...legacy } = save;
    expect(readSave(memory(JSON.stringify(legacy)), ids).showLabels).toBe(
      undefined,
    );
  });
});

describe("twelve-city additions", () => {
  it("preserves four-city progress while new cities are played and saved independently", async () => {
    const { cities } = await import("../src/cities/packs");
    const roster = cities.map((city) => city.id);
    const oldCities = Object.fromEntries(
      roster.slice(0, 4).map((id, i) => {
        const entry = freshCity();
        entry.best = (i + 1) * 100;
        return [id, entry];
      }),
    );
    const storage = memory(
      JSON.stringify({
        version: 1,
        city: "shenzhen",
        locale: "en",
        cities: oldCities,
      }),
    );
    const save = readSave(storage, roster);
    expect(save.cities).toEqual(oldCities);
    for (const id of roster.slice(4)) {
      const entry = freshCity();
      entry.run.board = [2, 2, ...Array(14).fill(0)];
      entry.run = move(entry.run, "left", () => 0).run;
      entry.best = entry.run.score;
      entry.discovered = [2, 4];
      save.city = id;
      save.cities[id] = entry;
      expect(writeSave(storage, save)).toBe(true);
      expect(readSave(storage, roster)).toEqual(save);
    }
    for (const id of roster.slice(0, 4))
      expect(save.cities[id]).toEqual(oldCities[id]);
  });
});
