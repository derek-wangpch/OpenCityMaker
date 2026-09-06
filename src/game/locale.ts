import type { Locale } from "../cities/types";

/** Match the first supported browser preference; an explicit script beats region. */
export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const parts = language.toLowerCase().split("-");
    if (parts[0] === "en") return "en";
    if (parts[0] !== "zh") continue;
    if (parts.includes("hant")) return "zh-HK";
    if (parts.includes("hans")) return "zh-CN";
    return parts.some((part) => ["hk", "mo", "tw"].includes(part))
      ? "zh-HK"
      : "zh-CN";
  }
  return "en";
}

export function browserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  return preferredLocale(
    navigator.languages?.length ? navigator.languages : [navigator.language],
  );
}
