import { describe, expect, it } from "vitest";
import { homeScreenState } from "../src/homeScreen";

const SAFARI_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const CHROME_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1";
// iPadOS 13+ requests desktop sites by default and reports itself as a Mac.
const SAFARI_IPADOS =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const SAFARI_MAC = SAFARI_IPADOS;
const WECHAT_IPHONE = `${SAFARI_IPHONE} MicroMessenger/8.0.49(0x18003128) NetType/WIFI Language/zh_CN`;
const CHROME_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

const state = (userAgent: string, { touch = 5, standalone = false } = {}) =>
  homeScreenState({ userAgent, maxTouchPoints: touch, standalone });

describe("home screen availability", () => {
  it("offers the steps to iPhone and iPad browsers that can add a page", () => {
    expect(state(SAFARI_IPHONE)).toBe("available");
    expect(state(CHROME_IPHONE)).toBe("available");
    expect(state(SAFARI_IPADOS)).toBe("available");
  });

  it("stays silent once the app runs from the Home Screen", () => {
    expect(state(SAFARI_IPHONE, { standalone: true })).toBe("installed");
    // Standalone wins even where the steps would otherwise be unavailable, so
    // a Chromium install never sees an iOS walkthrough.
    expect(state(CHROME_ANDROID, { standalone: true })).toBe("installed");
  });

  it("stays silent where the share sheet has no Home Screen entry", () => {
    // A desktop Mac shares the iPadOS user agent; only touch tells them apart.
    expect(state(SAFARI_MAC, { touch: 0 })).toBe("unsupported");
    expect(state(WECHAT_IPHONE)).toBe("unsupported");
    expect(state(CHROME_ANDROID)).toBe("unsupported");
  });
});
