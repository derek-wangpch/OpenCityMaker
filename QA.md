# Verification inventory

## Automated rule and data checks

- Directional compression; separated tiles; two pairs; one-merge-per-turn; movement provenance.
- Invalid moves and completed runs consume no randomness.
- Uniform empty-cell selection; exact 90% spawn boundary; full-board spawn behavior.
- Score accumulation, immutable input, single-step undo, win detection, and horizontal/vertical escape from loss.
- Mass conservation over 100 generated boards in all four directions.
- Per-city save round trips, undo restoration, corrupt/version-mismatched/blocked storage, invalid values, stale status, and discovery recovery.
- All city translations, tier order, references, model keys, duplicate pack IDs, and finite model bounds for all 132 buildings across twelve shipped cities.
- Model keys are globally unique, carry their city's prefix, and leave no orphan factories; `validatePacks` rejects a pack pair that shares a key.
- Every palette is four well-formed hex colors and every city has its own ground tone and a non-blank native name.
- Preview cache keys are composed from city ID and model, so the same model name in two cities cannot collide.
- Growing the city roster leaves an existing save untouched and omits the new city until it is played.

### IndexedDB progress and match history

- One-time legacy migration that leaves the `citymaker:v1` backup untouched and never re-imports it after a newer IndexedDB save exists.
- Session metadata added to migrated saves, kept stable across loads, with no invented history for runs played before migration.
- Serialized concurrent saves; each city, locale, undo slot, and discovery set restored from the last committed write.
- Restart archives a played run exactly once and ignores untouched boards; a finished record survives the start of the next run.
- Terminal results upsert by session ID: finishing twice updates one record, undoing the finishing move retracts it, and re-finishing restores the same record ID.
- An unavailable database rejects load and save instead of reporting a false success.

## Browser interaction checks (Chromium)

- Keyboard merge, score update, collection discovery, undo, personal best retention, city independence, reload persistence.
- Restart cancel and confirm; all language options; localized document language; help dialog; Escape and focus return.
- Landmark atlas and interactive model rotation by drag and keyboard.
- Phone touch swipe via Chromium touch events; directional button taps; controls inside a 390×844 viewport.
- Atlas at 360×740 and all 132 model cards in the development gallery.
- Dense board with high and low buildings; terminal win; blocked further moves; restart from win/loss.
- Corrupt localStorage reload; unavailable localStorage and WebGL; reduced-motion mode.
- Legacy save migrated on first load, match history listing a completed run, undo retracting it, re-finishing, restart archiving, reload persistence, localized history text, per-city filtering, and the preserved legacy backup value.
- Visiting a city absent from the seeded save creates a fresh run that survives a reload alongside the cities the save did contain.
- The city rail scrolls within the viewport at 360px rather than widening the document, keeps the selected city inside its own bounds, and its arrow keys move focus without moving the board.
- Weather button cycles clear → cloudy → rain → snow → fog → off with the localized state in its accessible name, persists the choice across reloads through IndexedDB, tints `--scene` per state, and keeps the gallery's model contexts free of weather. Reduce motion parks weather on one static frame (frame counter stays flat); rain without reduce-motion streams frames. The button fits the 360px mobile bottom bar without document overflow.
- Per-city headings in the development gallery.

## Visual checks

Artifacts cover the English desktop game, both Chinese variants, mobile game and atlas, 132-model gallery, rotating landmark detail, dense desktop/mobile boards, win overlay, and the desktop/mobile match-history dialog. Inspect tiles, values, landmark silhouettes, clipping, dialog fit, control visibility, and horizontal overflow separately from assertion results. The initial mobile play surface includes the city switcher, score, board, undo/restart, and move controls; supplementary collection content scrolls below. Weather artifacts (`weather-rain/snow/fog.png`, `weather-mobile.png`) add the rain, snow, and fog moods on Beijing's board and the four-button mobile bar; check that clear weather still matches the pre-weather screenshots exactly, that particles stay inside the island's airspace, and that the fog mood blends into the CSS sky.

## Boundaries

Browser automation uses Chromium with a software WebGL renderer. Phone tests emulate touch and viewport size; they do not establish physical-phone GPU performance, native Safari behavior, battery use, or Android/iOS hardware compatibility. No deployment, account synchronization, native packaging, or installable/offline service worker is included. Continuous weather rendering (~30 fps, board view only) was not measured for battery or thermal impact on physical hardware; it stops when the tab is hidden, when Reduce motion is on, and after transitions to clear finish; off stops effects immediately.

The permanent contract checks URL syntax only. The eight-city expansion additionally checked all 79 distinct new reference URLs by HTTP GET with redirects: 58 returned 200 and 21 returned access restrictions (202/403/406); no 404 or connection failures remained. See [reference-checks.json](docs/qa/reference-checks.json) for each building, final URL and result. Restricted pages still require a browser/network environment that can access their content; they are not claimed as successfully fetched. On 2026-09-05, all ten distinct Shanghai/Shenzhen reference URLs returned HTTP 200 after redirects. Model distinctness is a judgment made by inspecting `/?gallery`, not an assertion — the automated bounds test would accept two identical silhouettes.

Unit tests exercise IndexedDB through `fake-indexeddb`, not a shipping browser engine; the Chromium scenario covers the real implementation for one migration and history flow. Saves are per-browser-profile and are never synchronized between browsers, devices, or WeChat. Storage-eviction behavior under disk pressure, private-browsing quotas, and Safari's IndexedDB eviction policy are untested. History accumulates without a size cap or pruning; only small histories were exercised. The Canvas 2D WeChat prototype was built and executed in a wx-only test environment; it has twelve-city text, switching and version-1 storage compatibility. Nothing was run in WeChat Developer Tools or on a physical WeChat client; see [WECHAT.md](WECHAT.md).

## Preview generation cost

Earlier measurements in Chromium with a software renderer, median of five cold loads from `goto("/")` to the sidebar preview being visible:

| Cities | Preview generation            | Median  |
| ------ | ----------------------------- | ------- |
| 2      | eager, whole catalog          | 1876 ms |
| 4      | eager, whole catalog          | 2590 ms |
| 4      | active city, rest during idle | 1948 ms |

Those earlier measurements compared the three configurations before the latest model refinements. Only eleven previews are synchronously generated for the active city, but total time to a visible image also includes page load, rendering, decoding, and scheduling; these timings do not isolate those costs. No wall-clock assertion is made in CI.

### Historical four-city recheck — 2026-09-05

Five alternating fresh-browser-context loads per version, Chromium/SwiftShader, development servers with separate dependency caches. The two-city baseline is commit `83f5117` (before deferred previews); the four-city result includes the existing local model refinements. Timing starts before `goto("/")` and ends when `.discovery-image img` is visible.

| Version                    | Individual loads (ms)        | Median  |
| -------------------------- | ---------------------------- | ------- |
| Two-city baseline          | 4917, 2326, 2338, 2282, 2367 | 2338 ms |
| Current four-city checkout | 2770, 2802, 2710, 2758, 2784 | 2770 ms |

The current checkout was 432 ms (18.5%) slower in this sample. The plan's hoped-for end-to-end speedup was not reproduced; rendering eleven active-city previews is implemented, but it is not evidence of a faster visible first preview. These development-server measurements include startup/transform effects and are not production or physical-phone benchmarks.

## Twelve-city verification — 2026-09-05

The original city order is preserved, followed by Tokyo, Singapore, Dubai, Sydney, New York, Paris, London and Rome. All 132 factories have finite position/normal coordinates, fit x/z ±0.8 and height 2.65, have unique prefixed keys, complete three-language metadata and distinct city ground colors. Tests retain an old four-city save while independently creating, playing and reloading the eight new cities. WeChat retains version 1 and original indices, extends old progress arrays, traverses all twelve cities, restores Rome and wraps back to Beijing.

Browser coverage includes badges 10 Paris, 11 London and 12 Rome; Rome restoration at 360px; arrow/Home/End focus without changing the board; decoding every one of the 132 thumbnails; twelve headings; and no document overflow at 1440, 390 and 360px. Nineteen landmark viewers are checked before and after rotation. Each city has full-resolution desktop and 360px sheets. Full-catalog screenshots use 40% pixel scale because the complete page exceeds SwiftShader's screenshot surface limit; individual city sheets retain normal resolution.

Visual inspection covered all eight new city sheets and nineteen rotated landmarks, including the red/white Tokyo Tower versus the Eiffel lattice, three structurally different bridges, open museum/frame/arch shapes, dome silhouettes, housing styles, the Statue of Liberty, and the Opera House's thick curved shells. The models are deliberately stylized; automated geometry checks do not establish visual fidelity.

### Production performance (before the Opera House correction)

Reproduce with `node scripts/measure-city-performance.mjs /path/to/four-city/dist` after building both versions. The preserved four-city baseline is commit `d7ccf88`. Chromium 153 / SwiftShader, 1440×1100, one warmup per version, then five alternating fresh contexts; external font requests blocked equally. Timing is navigation to a visible discovery thumbnail, not isolated geometry time.

| Version       | Five loads (ms)              | Median  | All initial JS raw / gzip |
| ------------- | ---------------------------- | ------- | ------------------------- |
| Four cities   | 1281, 1319, 1262, 1256, 1247 | 1262 ms | 792.57 / 225.79 kB        |
| Twelve cities | 1282, 1285, 1712, 1696, 1259 | 1285 ms | 862.83 / 253.56 kB        |

The twelve-city median was 23 ms (1.8%) slower in this sample; this is not evidence of a performance improvement or a stable CI threshold. The index chunk is 347.96 kB raw / 122.53 kB gzip, below 350 kB, so no additional static content split was needed. Three.js is 514.87 / 131.03 kB and still triggers Vite's size advisory. CSS adds 18.42 / 4.84 kB. All initial JS plus CSS totals 881.24 / 258.40 kB for twelve cities; this excludes HTML and external fonts.

After all 44/132 images decoded and a forced JS garbage collection, retained JS heap measured 4.8/6.5 MiB. Summed Chromium process RSS was 567.0/597.1 MiB. RSS double-counts shared pages and is not Task Manager private footprint or device GPU memory. Thumbnail RGBA storage at 280×260 is an estimate of 12.2/36.7 MiB, not measured allocation. No cache eviction was introduced. Raw runs, asset sizes and caveats are preserved in [city-performance.json](docs/qa/city-performance.json).

## Final checks

TypeScript checks, all 35 unit/contract tests in six files, all 12 Chromium browser scenarios, the production web build, and the actual generated WeChat wx-only bundle test passed. The final browser suite completed in 2.6 minutes. The WeChat bundle is 56.1 kB raw and contains no Three.js or browser runtime. No physical WeChat client or WeChat DevTools validation was performed.

Original four-city model/data files are unchanged. No commit, push or publication was made. Unrelated existing workspace content was preserved.

## Opera House silhouette correction — 2026-09-05

The first model's vertically tapered leaf surfaces did not read as roof vaults. The replacement has two staggered auditorium groups, curved paired sides meeting at pointed ridges, reverse-facing end caps, recessed glass ends, fine mullions, and a broad stepped podium. Roofs are closed custom surfaces with 0.023-unit thickness. Three rotated views and the neighboring Sydney models were visually inspected. The source now links directly to the Opera House's official spherical-solution article (HTTP 200).

After the correction the production entry is 348.65 kB raw / 122.85 kB gzip, still below the content-splitting threshold. The timing and memory figures above describe the pre-correction expansion build, not a fresh benchmark of this individual model correction.

Correction verification: TypeScript, all 35 unit tests, all 12 Chromium scenarios (2.4 minutes), and production build passed. Updated Sydney sheets and rotated detail screenshots were generated; the front view is saved locally as `artifacts/screenshots/models/model-sy-opera-front.png`.

## Landmark and navigation refinement — 2026-09-05

One World Trade Center now uses the cubic base, eight chamfered facets, rotated square crown and antenna described by SOM. The Arc de Triomphe has a true through-arch, deep side piers and an attic block. Burj Khalifa uses three rotating buttressed wings with stepped setbacks around a central core. Two IFC uses a chamfered rectangular shaft, tapered crown and crown cap rather than a round tower. The four models were checked in the gallery at multiple angles.

The 12-city selector is now a bounded horizontal carousel with fixed-width city buttons, arrow controls, scroll snapping and keyboard focus centering. Undiscovered atlas thumbnails are blurred while their names and lock state remain available. The collection strip applies the same blur treatment to locked miniatures.

The undiscovered treatment was simplified on 2026-09-05 to blur only; no opaque marker or veil is placed over the miniature. Shenzhen's 城中村握手楼 was lowered to a five-floor maximum and rechecked in the viewer.

The Shenzhen 城中村 model was then refined to two parallel, closely spaced low-rise rows with windows on both sides and shared rooftop water tanks, matching the front/back handshake-building layout.

Beijing's Siheyuan was reshaped into one continuous south room with an outward-facing street gate, paired inward-facing east/west wings, a rear wing and a visible open courtyard. The updated viewer image is generated locally at `artifacts/screenshots/models/model-bj-courtyard.png`.

Beijing's Hutong cluster now uses two parallel rows of three low courtyard houses, all facing a narrow paved lane that runs front-to-back with open exits at both ends. The updated viewer image is generated locally at `artifacts/screenshots/models/model-bj-hutong.png`.

St Paul's Cathedral's main roof was corrected from a tall bulb to a broad drum with three shallow tapered dome courses, a lantern and a needle. The updated viewer image is generated locally at `artifacts/screenshots/models/model-ld-stpauls.png`.

For local `localhost`/`127.0.0.1` test sessions, the blur is disabled so model QA can inspect every thumbnail directly. Hosted/production origins keep the undiscovered blur.

## Weather effects — 2026-09-06

A six-state weather cycle (clear → cloudy → rain → snow → fog → off) is available on web and in the WeChat prototype. The web renderer uses soft cloud sprites with six silhouette variants, rain streaks, snow particles, and low mist with depth fog. Cloud bounds account for their full sprite size. Lighting, particle opacity, fog, and the board background blend over three seconds; interrupted transitions continue from their current blend. Off clears effects immediately and disables automatic weather changes. Reduced motion displays a deterministic static frame. Weather is confined to the board; model previews remain unaffected.

The WeChat prototype uses simple 2D overlays and the same persisted weather cycle. Its tick chain stops on hide, modal, or off; it does not implement the web renderer's visual transitions.

Current verification: 13 focused weather/WeChat unit tests pass, including persisted off state, cloud bounds, gradual transitions, interrupted fog transitions, and static reduced motion. The browser scenarios cover weather cycling, persistence, localized labels, gallery isolation, and mobile fit, but have not been rerun for this refinement. Full type checking is blocked by unrelated building-preview tests. Physical-device performance and the final visual transitions remain unverified.
