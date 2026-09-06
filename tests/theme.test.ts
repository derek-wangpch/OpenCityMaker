import { describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  nextThemePreference,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
  type ThemeStorage,
} from "../src/theme";

function memory(
  value: string | null = null,
): ThemeStorage & { value: () => string | null } {
  let current = value;
  return {
    getItem: () => current,
    setItem: (_, next) => {
      current = next;
    },
    value: () => current,
  };
}

describe("appearance preference", () => {
  it("defaults invalid or missing values to system", () => {
    expect(readThemePreference(memory())).toBe("system");
    expect(readThemePreference(memory("sepia"))).toBe("system");
    expect(readThemePreference(memory("dark"))).toBe("dark");
  });

  it("cycles System to Light to Dark and back", () => {
    expect(nextThemePreference("system")).toBe("light");
    expect(nextThemePreference("light")).toBe("dark");
    expect(nextThemePreference("dark")).toBe("system");
  });

  it("resolves only System from the device preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("persists independently and tolerates blocked storage", () => {
    const storage = memory();
    expect(writeThemePreference(storage, "dark")).toBe(true);
    expect(storage.value()).toBe("dark");
    expect(readThemePreference(storage)).toBe("dark");
    expect(THEME_STORAGE_KEY).toBe("citymaker:theme");

    const blocked = {
      getItem: () => {
        throw Error("blocked");
      },
      setItem: () => {
        throw Error("blocked");
      },
    };
    expect(readThemePreference(blocked)).toBe("system");
    expect(writeThemePreference(blocked, "light")).toBe(false);
    expect(writeThemePreference(undefined, "dark")).toBe(false);
  });
});
