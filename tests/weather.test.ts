import { describe, it, expect } from "vitest";
import {
  WEATHERS,
  mixHex,
  nextWeather,
  randomWeather,
  readWeather,
  sceneSkyTint,
  skyTint,
} from "../src/game/weather";
import { freshCity, readSave, writeSave, type Save } from "../src/game/storage";
const ids = ["beijing", "hongkong"];
function memory(raw: string | null = null) {
  let value = raw;
  return {
    getItem: () => value,
    setItem: (_: string, v: string) => {
      value = v;
    },
  };
}
describe("weather state machine", () => {
  it("cycles all weather modes through off and back to clear", () => {
    expect(WEATHERS).toEqual(["clear", "cloudy", "rain", "snow", "fog", "off"]);
    let state = nextWeather("clear");
    const order = [state];
    while (state !== "clear") {
      state = nextWeather(state);
      order.push(state);
    }
    expect(order).toEqual(["cloudy", "rain", "snow", "fog", "off", "clear"]);
    expect(randomWeather("rain", () => 0)).toBe("clear");
    expect(randomWeather("rain", () => 0.99)).toBe("fog");
  });
  it("validates stored values and defaults everything else to clear", () => {
    expect(readWeather("off")).toBe("off");
    expect(randomWeather("off")).toBe("off");
    for (let i = 0; i < 100; i++)
      expect(randomWeather("clear", () => i / 100)).not.toBe("off");
    expect(readWeather("rain")).toBe("rain");
    expect(readWeather("storm")).toBeUndefined();
    expect(readWeather(3)).toBeUndefined();
    expect(readWeather(undefined)).toBeUndefined();
  });
});
describe("sky tinting", () => {
  it("leaves the clear sky untouched", () => {
    expect(skyTint("#e6ecdf", "off")).toBe("#e6ecdf");
    expect(skyTint("#e6ecdf", "clear")).toBe("#e6ecdf");
  });
  it("mixes the per-weather tint into the city background", () => {
    // Beijing's pale green sky under each weather.
    expect(skyTint("#e6ecdf", "rain")).toBe("#adb5b2");
    expect(skyTint("#e6ecdf", "snow")).toBe("#e4ebe5");
    expect(skyTint("#e6ecdf", "fog")).toBe("#e3e8de");
    // Dubai's cream sky under rain.
    expect(skyTint("#f4edda", "rain")).toBe("#b6b6af");
  });
  it("mixes per channel and clamps to the sRGB range", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHex("#ffffff", "#000000", 2)).toBe("#000000");
    expect(mixHex("#102030", "#102030", 0.9)).toBe("#102030");
  });
  it("keeps every dark weather sky moonlit and city-tinted", () => {
    const light = sceneSkyTint("#e6ecdf", "clear", "light");
    const dark = sceneSkyTint("#e6ecdf", "clear", "dark");
    expect(light).toBe("#e6ecdf");
    expect(dark).toBe("#3f4749");
    expect(sceneSkyTint("#f4edda", "clear", "dark")).not.toBe(dark);
    expect(sceneSkyTint("#e6ecdf", "snow", "dark")).not.toBe(dark);
  });
});
describe("weather persistence", () => {
  const save: Save = {
    version: 1,
    city: "beijing",
    locale: "en",
    cities: { beijing: freshCity() },
    weather: "snow",
  };
  it("remembers the weather only when it is a known value", () => {
    const storage = memory();
    writeSave(storage, { ...save, weather: "off" });
    expect(readSave(storage, ids).weather).toBe("off");
    writeSave(storage, save);
    expect(readSave(storage, ids)).toEqual(save);
    expect(
      readSave(memory(JSON.stringify({ ...save, weather: "storm" })), ids)
        .weather,
    ).toBeUndefined();
    expect(
      readSave(memory(JSON.stringify({ ...save, weather: 2 })), ids).weather,
    ).toBeUndefined();
    const { weather: _omit, ...legacy } = save;
    expect(readSave(memory(JSON.stringify(legacy)), ids).weather).toBe(
      undefined,
    );
  });
});
