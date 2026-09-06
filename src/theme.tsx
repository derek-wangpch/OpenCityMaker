import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const THEME_STORAGE_KEY = "citymaker:theme";
export const THEME_QUERY = "(prefers-color-scheme: dark)";
export const THEME_COLORS = { light: "#f5f3eb", dark: "#171c1a" } as const;

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readThemePreference(
  storage: ThemeStorage | undefined,
): ThemePreference {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system"
      ? value
      : "system";
  } catch {
    return "system";
  }
}

export function writeThemePreference(
  storage: ThemeStorage | undefined,
  preference: ThemePreference,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(THEME_STORAGE_KEY, preference);
    return true;
  } catch {
    return false;
  }
}

export const resolveTheme = (
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme =>
  preference === "system" ? (systemDark ? "dark" : "light") : preference;

export const nextThemePreference = (
  preference: ThemePreference,
): ThemePreference =>
  ({ system: "light", light: "dark", dark: "system" })[
    preference
  ] as ThemePreference;

export function applyTheme(
  document: Document,
  preference: ThemePreference,
  resolved: ResolvedTheme,
) {
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = resolved;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[resolved]);
}

function browserThemeStorage(): ThemeStorage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() =>
      readThemePreference(browserThemeStorage()),
    ),
    [systemDark, setSystemDark] = useState(
      () => window.matchMedia(THEME_QUERY).matches,
    ),
    resolved = resolveTheme(preference, systemDark);

  useEffect(() => {
    const query = window.matchMedia(THEME_QUERY);
    const listener = () => setSystemDark(query.matches);
    listener();
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  useLayoutEffect(() => {
    applyTheme(document, preference, resolved);
    writeThemePreference(browserThemeStorage(), preference);
  }, [preference, resolved]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      cycle: () => setPreference((current) => nextThemePreference(current)),
    }),
    [preference, resolved],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
