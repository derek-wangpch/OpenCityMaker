/** Shared board badge and base-ring colors for extended landmark tiers. */
export function tileAccent(value: number): string | undefined {
  return value >= 16384
    ? "#36b9c7"
    : value >= 8192
      ? "#ad82e8"
      : value >= 4096
        ? "#e7b74f"
        : undefined;
}
export const showTileLabel = (value: number, labels: boolean) =>
  labels || value > 2048;
