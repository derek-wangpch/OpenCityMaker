/**
 * Diorama weather: the state machine shared by the web app, the WeChat build
 * and the tests. Pure data only — the three.js side lives in src/scene/weather.ts.
 */
export const WEATHERS = [
  "clear",
  "cloudy",
  "rain",
  "snow",
  "fog",
  "off",
] as const;
export type Weather = (typeof WEATHERS)[number];

// Typical urban weather, rather than rare historical or nearby mountain snow.
const SNOW_FREE_CITIES = new Set([
  "hongkong",
  "shenzhen",
  "singapore",
  "dubai",
  "sydney",
]);
const WITHOUT_SNOW = WEATHERS.filter((weather) => weather !== "snow");

export function cityWeathers(city?: string): readonly Weather[] {
  return city && SNOW_FREE_CITIES.has(city) ? WITHOUT_SNOW : WEATHERS;
}

/** Toolbar order follows the city's supported weather, including off. */
export function nextWeather(w: Weather, city?: string): Weather {
  const choices = cityWeathers(city);
  return choices[(choices.indexOf(w) + 1) % choices.length];
}

/** Pick a different weather for the automatic changeover. */
export function randomWeather(
  current: Weather,
  city?: string,
  random = Math.random,
): Weather {
  if (current === "off") return "off";
  const choices = cityWeathers(city).filter(
    (weather) => weather !== "off" && weather !== current,
  );
  return choices[Math.floor(random() * choices.length)] ?? "clear";
}

/** Unknown saves are ignored; weather unsupported by the city resets to clear. */
export function readWeather(v: unknown, city?: string): Weather | undefined {
  if (typeof v !== "string" || !(WEATHERS as readonly string[]).includes(v))
    return undefined;
  return cityWeathers(city).includes(v as Weather) ? (v as Weather) : "clear";
}

/** Sky tint mixed over the city background. Clear is a pass-through. */
const TINT: Record<
  Exclude<Weather, "clear" | "off">,
  { color: string; mix: number }
> = {
  rain: { color: "#3d4a5c", mix: 0.34 }, // storm grey-blue
  cloudy: { color: "#9aa8ad", mix: 0.23 }, // soft overcast blue-grey
  snow: { color: "#dfe7f2", mix: 0.3 }, // cool brightness
  fog: { color: "#dfe3dc", mix: 0.42 }, // pale haze
};

export function skyTint(background: string, weather: Weather): string {
  if (weather === "clear" || weather === "off") return background;
  const { color, mix } = TINT[weather];
  return mixHex(background, color, mix);
}

/** A city-tinted moonlit sky. Weather keeps its identity without returning to daylight. */
export function sceneSkyTint(
  background: string,
  weather: Weather,
  theme: "light" | "dark",
): string {
  const weathered = skyTint(background, weather);
  if (theme === "light") return weathered;
  const night = weather === "snow" || weather === "fog" ? "#1d2932" : "#10191f";
  return mixHex(weathered, night, weather === "snow" ? 0.68 : 0.78);
}

/** Per-channel sRGB mix of two #rrggbb colors, rounded. */
export function mixHex(a: string, b: string, t: number): string {
  const parse = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [ca, cb] = [parse(a), parse(b)];
  const hex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${ca.map((v, i) => hex(v + (cb[i] - v) * t)).join("")}`;
}
