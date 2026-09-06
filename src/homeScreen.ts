/**
 * Whether this visit can put CityMaker on the device Home Screen.
 *
 * Safari exposes no install API — an iPhone or iPad user goes through the
 * share sheet by hand — so the only thing the app can do is recognize that
 * device and show the steps. Chromium's `beforeinstallprompt` is deliberately
 * not used: without a service worker it would not fire anyway.
 *
 * "installed" means the page is already running from the Home Screen, in which
 * case offering the steps again would only be confusing.
 */
export type HomeScreenState = "available" | "installed" | "unsupported";

/** iPadOS 13+ claims to be a Mac; only the touch points give it away. */
const APPLE_MOBILE = /iPhone|iPad|iPod/;
/**
 * Embedded webviews (WeChat, Weibo, in-app social browsers) draw their own
 * toolbar and offer no Home Screen entry, so the steps would be a dead end.
 * Chrome, Edge and Firefox for iOS do offer it and are intentionally allowed.
 */
const EMBEDDED = /MicroMessenger|Weibo|QQ\/|FBAN|FBAV|FBIOS|Instagram|Line\//;

export function homeScreenState(env: {
  userAgent: string;
  maxTouchPoints: number;
  /** `navigator.standalone`, or a standalone display mode. */
  standalone: boolean;
}): HomeScreenState {
  if (env.standalone) return "installed";
  const apple =
    APPLE_MOBILE.test(env.userAgent) ||
    (env.userAgent.includes("Macintosh") && env.maxTouchPoints > 1);
  if (!apple || EMBEDDED.test(env.userAgent)) return "unsupported";
  return "available";
}

/** The state of the current document; it cannot change without a reload. */
export function browserHomeScreen(): HomeScreenState {
  return homeScreenState({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
    standalone:
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      matchMedia("(display-mode: standalone)").matches,
  });
}
