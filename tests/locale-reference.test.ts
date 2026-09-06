import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { preferredLocale } from "../src/game/locale";
import { readSave } from "../src/game/storage";
import { IndexedDbRepository } from "../src/game/repository";
import { cities } from "../src/cities/packs";
import { baiduReferences, buildingReference } from "../src/cities/references";

describe("first-visit language", () => {
  it.each([
    [["zh-CN"], "zh-CN"],
    [["zh-SG"], "zh-CN"],
    [["zh"], "zh-CN"],
    [["zh-TW"], "zh-HK"],
    [["zh-HK"], "zh-HK"],
    [["zh-MO"], "zh-HK"],
    [["zh-Hant-CN"], "zh-HK"],
    [["zh-Hans-HK"], "zh-CN"],
    [["en-US", "zh-CN"], "en"],
    [["fr-FR", "zh-CN", "en"], "zh-CN"],
    [["ZH-hant"], "zh-HK"],
    [["ja-JP"], "en"],
    [[], "en"],
  ])("matches %j to %s", (languages, locale) => {
    expect(preferredLocale(languages)).toBe(locale);
  });

  it("uses browser preference only when no valid saved language exists", () => {
    expect(readSave(undefined, ["beijing"], "zh-CN").locale).toBe("zh-CN");
    for (const locale of ["en", "zh-CN", "zh-HK", "invalid"]) {
      const storage = {
        getItem: () => JSON.stringify({ version: 1, locale }),
        setItem: () => {},
      };
      expect(readSave(storage, ["beijing"], "zh-CN").locale).toBe(
        locale === "invalid" ? "zh-CN" : locale,
      );
    }
    expect(
      readSave(
        { getItem: () => "broken", setItem: () => {} },
        ["beijing"],
        "zh-HK",
      ).locale,
    ).toBe("zh-HK");
  });

  it("persists manual selection across reloads with another browser preference", async () => {
    const factory = new IDBFactory();
    const first = new IndexedDbRepository(
      ["beijing"],
      factory,
      undefined,
      undefined,
      "zh-CN",
    );
    const save = await first.load();
    expect(save.locale).toBe("zh-CN");
    await first.save({ ...save, locale: "en" });
    first.close();
    const next = new IndexedDbRepository(
      ["beijing"],
      factory,
      undefined,
      undefined,
      "zh-HK",
    );
    expect((await next.load()).locale).toBe("en");
    next.close();
  });

  it("keeps the legacy language when migrating to IndexedDB", async () => {
    const legacy = {
      getItem: () => JSON.stringify({ version: 1, locale: "zh-HK" }),
      setItem: () => {},
    };
    const repo = new IndexedDbRepository(
      ["beijing"],
      new IDBFactory(),
      legacy,
      undefined,
      "zh-CN",
    );
    expect((await repo.load()).locale).toBe("zh-HK");
    repo.close();
  });
});

describe("localized building references", () => {
  const buildings = cities.flatMap((city) => city.buildings);
  it("uses verified Baidu references only for Simplified Chinese, retaining all fallbacks", () => {
    for (const building of buildings) {
      expect(buildingReference(building, "en")).toBe(building.sources[0]);
      expect(buildingReference(building, "zh-HK")).toBe(building.sources[0]);
      expect(buildingReference(building, "zh-CN")).toBe(
        baiduReferences[building.model] ?? building.sources[0],
      );
    }
  });
  it("contains only existing models and explicit Baidu article IDs", () => {
    const models = new Set(buildings.map((building) => building.model));
    for (const [model, url] of Object.entries(baiduReferences)) {
      expect(models.has(model), model).toBe(true);
      expect(url).toMatch(
        /^https:\/\/baike\.baidu\.com\/item\/[^/]+\/[1-9]\d*$/,
      );
    }
  });
});
