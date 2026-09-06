import { useSyncExternalStore } from "react";
export type Route = "start" | "cities" | "play" | "atlas";
export const paths: Record<Route, string> = {
  start: "#/",
  cities: "#/cities",
  play: "#/play",
  atlas: "#/atlas",
};
export function parseRoute(hash: string): Route {
  const found = (Object.keys(paths) as Route[]).find(
    (route) => paths[route] === hash,
  );
  return found ?? "start";
}
/**
 * Every pushed entry remembers how deep it sits and which page opened it, so a
 * page reached from two places (the atlas) knows where its back button leads.
 * History state survives a reload, so the answer holds after one too.
 */
type Entry = { depth: number; from: Route };
function entry(): Entry {
  const state = history.state as Partial<Entry> | null;
  return { depth: state?.depth ?? 0, from: state?.from ?? "start" };
}
/**
 * Mobile pages live in the URL hash so the OS back gesture walks back through
 * them. Assigning `location.hash` pushes a history entry.
 */
export function useHashRoute() {
  const hash = useSyncExternalStore(
    (notify) => {
      addEventListener("hashchange", notify);
      return () => removeEventListener("hashchange", notify);
    },
    () => location.hash,
  );
  const route = parseRoute(hash);
  return {
    route,
    /** The page the current one was opened from. */
    from: entry().from,
    navigate(next: Route) {
      if (next === route) return;
      const { depth } = entry();
      location.hash = paths[next];
      // The assignment above pushed the entry synchronously; tag it before the
      // hashchange listeners render the new page.
      history.replaceState({ depth: depth + 1, from: route } as Entry, "");
    },
    /**
     * Pop instead of pushing home, so the in-app back button lands exactly
     * where the OS back gesture would: the game, when the game opened us.
     */
    back() {
      const { depth, from } = entry();
      if (depth > 0) history.back();
      else location.hash = paths[from];
    },
  };
}
