import { useSyncExternalStore } from "react";
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const media = matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => matchMedia(query).matches,
  );
}
/** Phone breakpoint shared by the layout switch and `src/mobile.css`. */
export const MOBILE_QUERY = "(max-width: 740px)";
