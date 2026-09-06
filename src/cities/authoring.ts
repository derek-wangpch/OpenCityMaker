import { localized as l, type Building } from "./types";
export { localized as l } from "./types";
export function b(
  tier: number,
  model: string,
  names: [string, string, string],
  descriptions: [string, string, string],
  source: string,
): Building {
  return {
    value: 2 ** tier,
    model,
    name: l(...names),
    description: l(...descriptions),
    sources: [source],
  };
}
