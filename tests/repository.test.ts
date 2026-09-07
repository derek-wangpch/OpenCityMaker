import { IDBFactory } from "fake-indexeddb";
import { describe, it, expect } from "vitest";
import { IndexedDbRepository } from "../src/game/repository";
import { freshCity, type Save } from "../src/game/storage";
import { continueRun, move, undo } from "../src/game/engine";
const ids = ["beijing", "hongkong"];
function setup(raw: string | null = null) {
  const factory = new IDBFactory();
  let legacy = raw;
  const storage = {
    getItem: () => legacy,
    setItem: (_: string, v: string) => {
      legacy = v;
    },
  };
  return {
    repo: new IndexedDbRepository(ids, factory, storage),
    factory,
    storage,
  };
}
function initial(): Save {
  return {
    version: 1,
    city: "beijing",
    locale: "en",
    cities: { beijing: freshCity() },
  };
}
describe("IndexedDB progress and history", () => {
  it("persists rotation across reopening without altering a run or completed history", async () => {
    const { repo, factory } = setup();
    const original = initial();
    original.cities.beijing.run.status = "won";
    original.cities.beijing.run.hasWon = true;
    original.cities.beijing.run.board = [2048, 2, ...Array(14).fill(0)];
    original.cities.beijing.discovered = [2, 2048];
    await repo.save(original);
    const history = await repo.history();
    for (let step = 0; step < 8; step++) {
      await repo.save({ ...original, boardRotationStep: step });
    }
    repo.close();
    const reopened = new IndexedDbRepository(ids, factory);
    expect(await reopened.load()).toEqual({
      ...original,
      boardRotationStep: 7,
    });
    expect(await reopened.history()).toEqual(history);
    reopened.close();
  });
  it("migrates once without deleting or overwriting the old backup", async () => {
    const original = initial();
    original.cities.beijing.best = 800;
    const { repo, storage } = setup(JSON.stringify(original));
    expect(await repo.load()).toEqual(original);
    const next = structuredClone(original);
    next.locale = "zh-HK";
    await repo.save(next);
    expect(storage.getItem()).toBe(JSON.stringify(original));
    storage.setItem("", JSON.stringify(initial()));
    expect((await repo.load()).locale).toBe("zh-HK");
    repo.close();
  });
  it("adds stable session metadata to legacy progress and does not invent old history", async () => {
    const old = initial();
    delete (old.cities.beijing as Partial<typeof old.cities.beijing>).session;
    const { repo } = setup(JSON.stringify(old));
    const migrated = await repo.load();
    expect(migrated.cities.beijing.session.id).toBeTruthy();
    expect(await repo.history()).toEqual([]);
    expect((await repo.load()).cities.beijing.session.id).toBe(
      migrated.cities.beijing.session.id,
    );
    repo.close();
  });
  it("serializes rapid saves and restores each city, locale, undo, and discoveries", async () => {
    const { repo } = setup();
    await repo.load();
    const first = initial();
    const second = structuredClone(first);
    second.locale = "zh-CN";
    second.cities.hongkong = freshCity();
    second.cities.beijing.best = 50;
    await Promise.all([repo.save(first), repo.save(second)]);
    expect(await repo.load()).toEqual(second);
    repo.close();
  });
  it("archives restart exactly once while ignoring untouched boards", async () => {
    const { repo } = setup();
    await repo.load();
    const first = initial();
    first.cities.beijing.session.moves = 8;
    first.cities.beijing.run.score = 40;
    await repo.save(first);
    const next = initial();
    await repo.save(next);
    await repo.save(next);
    const records = await repo.history();
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: first.cities.beijing.session.id,
      outcome: "restarted",
      moves: 8,
      score: 40,
      city: "beijing",
    });
    await repo.save(initial());
    expect(await repo.history()).toHaveLength(1);
    repo.close();
  });
  it("upserts terminal records and undo preserves the achievement", async () => {
    const { repo } = setup();
    await repo.load();
    const save = initial();
    save.cities.beijing.run.board = [1024, 1024, ...Array(14).fill(0)];
    save.cities.beijing.run = move(
      save.cities.beijing.run,
      "left",
      () => 0,
    ).run;
    save.cities.beijing.session.moves = 1;
    await repo.save(save);
    const [won] = await repo.history();
    expect(won.outcome).toBe("won");
    expect(won.highest).toBe(2048);
    await repo.save(save);
    expect(await repo.history()).toEqual([won]);
    save.cities.beijing.run = undo(save.cities.beijing.run);
    await repo.save(save);
    expect(await repo.history()).toHaveLength(1);
    save.cities.beijing.run = move(
      save.cities.beijing.run,
      "left",
      () => 0,
    ).run;
    await repo.save(save);
    expect(await repo.history()).toHaveLength(1);
    expect((await repo.history())[0].id).toBe(won.id);
    repo.close();
  });
  it("preserves a completed record when starting the next run", async () => {
    const { repo } = setup();
    await repo.load();
    const save = initial();
    save.cities.beijing.run.board = [
      2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2,
    ];
    save.cities.beijing.run.status = "lost";
    await repo.save(save);
    const [lost] = await repo.history();
    await repo.save(initial());
    expect(await repo.history()).toEqual([lost]);
    repo.close();
  });
  it("reports unavailable database operations instead of pretending to save", async () => {
    const repo = new IndexedDbRepository(ids, undefined);
    await expect(repo.load()).rejects.toThrow("unavailable");
    await expect(repo.save(initial())).rejects.toThrow("unavailable");
    repo.close();
  });
});

it("keeps one winning record through continuation, loss, and restart", async () => {
  const { repo } = setup();
  await repo.load();
  const save = initial();
  const city = save.cities.beijing;
  city.run.board = [1024, 1024, ...Array(14).fill(0)];
  city.run = move(city.run, "left", () => 0).run;
  await repo.save(save);
  city.run = continueRun(city.run);
  city.run.board = [2048, 2048, ...Array(14).fill(0)];
  city.run = move(city.run, "left", () => 0).run;
  city.session.moves = 2;
  await repo.save(save);
  expect((await repo.load()).cities.beijing.run).toEqual(city.run);
  expect(await repo.history()).toMatchObject([
    {
      id: city.session.id,
      outcome: "won",
      endedAt: null,
      highest: 4096,
      score: 6144,
      moves: 2,
    },
  ]);
  city.run.board = [4096, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
  city.run.status = "lost";
  await repo.save(save);
  const [finished] = await repo.history();
  expect(finished.outcome).toBe("won");
  expect(finished.endedAt).not.toBeNull();
  await repo.save(initial());
  expect(await repo.history()).toEqual([finished]);
  repo.close();
});
it("finalizes a continued winning game when restarting without a deadlock", async () => {
  const { repo } = setup();
  await repo.load();
  const save = initial();
  const city = save.cities.beijing;
  city.run = {
    ...city.run,
    board: [8192, 2, ...Array(14).fill(0)],
    hasWon: true,
    continued: true,
    score: 30000,
  };
  await repo.save(save);
  await repo.save(initial());
  const [record] = await repo.history();
  expect(record).toMatchObject({
    id: city.session.id,
    outcome: "won",
    score: 30000,
    highest: 8192,
  });
  expect(record.endedAt).not.toBeNull();
  repo.close();
});
