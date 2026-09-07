import { describe, expect, it } from "vitest";
import { CITY_IDS, Game, STORAGE_KEY } from "../src/wechat/state";

function memory() {
  let value: unknown;
  return {
    getStorageSync: () => structuredClone(value),
    setStorageSync: (_key: string, next: unknown) => {
      value = structuredClone(next);
    },
  };
}
describe("WeChat prototype persistence", () => {
  it.each(["hongkong", "shenzhen", "singapore", "dubai", "sydney"])(
    "normalizes saved snow and skips it in %s",
    (city) => {
      const storage = memory();
      const original = new Game(storage);
      original.state.city = CITY_IDS.indexOf(city);
      original.state.weather = "snow";
      original.save();
      const game = new Game(storage);
      expect(game.state.weather).toBe("clear");
      expect(game.state.progress).toEqual(original.state.progress);
      game.state.weather = "rain";
      game.cycleWeather();
      expect(game.state.weather).toBe("fog");
      expect(new Game(storage).state.weather).toBe("fog");
    },
  );
  it("normalizes snow when switching cities and preserves off", () => {
    const storage = memory();
    const game = new Game(storage);
    game.state.weather = "snow";
    game.nextCity(); // Beijing -> Hong Kong
    expect(game.state.weather).toBe("clear");
    expect(new Game(storage).state.weather).toBe("clear");
    game.state.weather = "off";
    game.nextCity(); // Hong Kong -> Shanghai
    expect(game.state.weather).toBe("off");
    game.state.weather = "rain";
    game.cycleWeather();
    expect(game.state.weather).toBe("snow");
    game.nextCity(); // Shanghai -> Shenzhen
    expect(game.state.weather).toBe("clear");
  });
  it("round trips moves and undo, keeps best, and isolates city runs", () => {
    const storage = memory(),
      game = new Game(storage);
    game.current.run = {
      board: [2, 2, ...Array(14).fill(0)],
      score: 0,
      status: "playing",
      undo: null,
    };
    game.move("left");
    expect(game.current.run.score).toBe(4);
    const restored = new Game(storage);
    expect(restored.current.run).toEqual(game.current.run);
    restored.undo();
    expect(restored.current.run.board.slice(0, 2)).toEqual([2, 2]);
    expect(restored.current.best).toBe(4);
    restored.nextCity();
    expect(restored.state.city).toBe(1);
    expect(new Game(storage).state.city).toBe(1);
    expect(restored.state.progress[0].best).toBe(4);
  });
  it("does not overwrite unreadable or future data even on background save", () => {
    let writes = 0;
    for (const read of [
      () => {
        throw Error("read failed");
      },
      () => ({ version: 99 }),
    ]) {
      const game = new Game({
        getStorageSync: read,
        setStorageSync: () => {
          writes++;
        },
      });
      game.restart();
      game.save();
      expect(game.notice).toContain("原存档保留");
    }
    expect(writes).toBe(0);
  });
  it("reports failed writes and retries without losing the current board", () => {
    let fail = true;
    const game = new Game({
      getStorageSync: () => undefined,
      setStorageSync: (key) => {
        expect(key).toBe(STORAGE_KEY);
        if (fail) throw Error("quota");
      },
    });
    game.save();
    expect(game.notice).toContain("保存失败");
    const board = [...game.current.run.board];
    fail = false;
    game.save();
    expect(game.notice).toBe("已保存在本机");
    expect(game.current.run.board).toEqual(board);
  });
  it("validates corrupt boards independently and derives terminal state", () => {
    const base = new Game(memory()).state;
    base.progress[0].run.board = [8192, ...Array(15).fill(0)];
    base.progress[1].run.board = [2048, 2, ...Array(14).fill(0)];
    const game = new Game({
      getStorageSync: () => base,
      setStorageSync: () => {},
    });
    expect(game.state.progress[0].run.board).not.toContain(8192);
    expect(game.state.progress[1].run.status).toBe("won");
  });
  it("remembers the weather only when it is a known value and cycles it", () => {
    const storage = memory(),
      game = new Game(storage);
    game.state.weather = "rain";
    game.save();
    expect(new Game(storage).state.weather).toBe("rain");
    game.cycleWeather();
    expect(game.state.weather).toBe("snow");
    game.cycleWeather();
    game.cycleWeather();
    expect(game.state.weather).toBe("off");
    expect(new Game(storage).state.weather).toBe("off");
    game.cycleWeather();
    expect(game.state.weather).toBe("clear");
    const corrupt = new Game({
      getStorageSync: () => ({ version: 1, city: 0, progress: [], weather: 3 }),
      setStorageSync: () => {},
    });
    expect(corrupt.state.weather).toBeUndefined();
  });
});

it("extends a four-city v1 save and cycles through the shared twelve-city roster", async () => {
  const { cities } = await import("../src/cities/packs");
  const { CITY_IDS } = await import("../src/wechat/state");
  expect(CITY_IDS).toEqual(cities.map((city) => city.id));
  const storage = memory(),
    original = new Game(storage);
  original.state.progress = original.state.progress.slice(0, 4);
  original.state.city = 3;
  original.state.progress.forEach((entry, i) => {
    entry.best = (i + 1) * 100;
  });
  original.save();
  const expanded = new Game(storage);
  expect(expanded.state.city).toBe(3);
  expect(expanded.state.progress.slice(0, 4)).toEqual(original.state.progress);
  expect(expanded.state.progress).toHaveLength(12);
  for (let i = 4; i < CITY_IDS.length; i++) {
    expanded.nextCity();
    expect(expanded.state.city).toBe(i);
    expanded.current.run.board = [2, 2, ...Array(14).fill(0)];
    expanded.move("left");
    expect(new Game(storage).current.run).toEqual(expanded.current.run);
  }
  const last = new Game(storage);
  expect(last.state.city).toBe(11);
  last.nextCity();
  expect(last.state.city).toBe(0);
  expect(last.state.progress[3]).toEqual(original.state.progress[3]);
});
