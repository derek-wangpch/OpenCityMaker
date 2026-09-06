# sy-centralpark — One Central Park

2026-09-06; tier 9 / value 512. Identity and Factory interface retained.

## Evidence inspected

Two rounds of Chinese/English searches: “悉尼 中央公园大楼 双塔 悬挑 镜面 侧面” / “One Central Park Jean Nouvel cantilever facade roof”, then “悉尼 One Central Park 屋顶 航拍 立面 镜面” / “One Central Park aerial roof west tower heliostat photo”.

Source: [Ateliers Jean Nouvel, built project and design drawings](https://www.jeannouvel.com/en/projects/one-central-park/). All images below were downloaded and opened, not inferred from captions:

- [Street facade photo, Roland Halbe 0060](https://www.jeannouvel.com/wp-content/uploads/2017/04/ajn-ptw-sydney-ocp-rolandhalbe-rh2336-0060.jpg): continuous planted vertical strips, balcony planters, shared podium, open mirror underside.
- [Park-side oblique photo, Roland Halbe 0024](https://www.jeannouvel.com/wp-content/uploads/2017/04/ajn-ptw-sydney-ocp-rolandhalbe-rh2336-0024.jpg): unequal towers, cantilever below upper residences, staggered balconies; low-roof angled mirrors visible.
- [Adjacent facade detail, Roland Halbe 0066](https://www.jeannouvel.com/wp-content/uploads/2017/04/ajn-ptw-sydney-ocp-rolandhalbe-rh2336-0066.jpg): alternating projecting balconies with discrete planting, not uniformly solid green cladding.
- [Architect section with heliostat light paths](https://www.jeannouvel.com/wp-content/uploads/2017/04/3-ajn-ptw-sydney-ocp-cpe-long-helio-e1516032524325.jpg): tower proportions, upper setbacks, separate low-roof mirrors and suspended array, podium connection. Design drawing, not as-built survey.
- [Planting elevation concept](https://www.jeannouvel.com/wp-content/uploads/2017/04/4-ajn-ptw-sydney-ocp-fac-est-e1516032541918.jpg): grouped vertical planting distribution. Concept only.
- [Aerial site photomontage](https://www.jeannouvel.com/wp-content/uploads/2017/04/1-ajn-ptw-sydney-ocp-site.jpg): broad plan relationship only; proposed building overlay is not an as-built aerial.
- [Structural engineer project](https://www.robertbird.com/rbg-projects/one-central-park/): supports distinction between structural sky garden and extended reflector frame.

After two rounds, no useful directly overhead as-built image or orthographic side survey was obtained. The aerial montage does not establish precise roof equipment. Tower depth, rear planting positions and simplified roof layout remain inferred; CTBUH PDF fetch failed (404). Front/adjacent/opposite oblique evidence and section are sufficient for core identity.

## Geometry and style constraints

X is tower separation/width, Y vertical, Z depth; A/front = +Z, B/side = +X, without claiming compass orientation. Low tower left, tall tower right in the game front. Shared low podium, two distinct horizontal roofs, upper residences continue above the cantilever. Cantilever extends toward the low tower and is not a bridge supported by it. Reflector panels have visible gaps and a dark supporting frame; low-roof angled mirrors form a second array.

Tier 9 high-detail treatment: grouped balcony slabs, asymmetric vertical green curtains, limited side planters, sky garden, exposed braces and two mirror arrays. Compared directly with completed tier 10 sy-harbourbridge default preview: fewer structural subdivisions and no fine railings, keeping the bridge's truss network richer. No shared helper changes.

Intentional cartoon choices: compressed height difference (1.04 vs 1.72 roof level), widened tower separation for legibility, enlarged mirror panels/green strips, muted blue-green glass and pale silver panels without photorealistic reflections. Floor bands stand for grouped floors. Omit actual panel count, plant species, irrigation, apartment glazing subdivisions, rooftop machinery, LEDs and surrounding precinct. Footprint under 1.6 × 1.6; overall height under existing 1.74 model envelope (and kit 2.65 maximum).

## Validation

Before and massing/final default/front/side/top previews use the existing model-preview harness at explicit PORT=5273. Product board, catalog and 390×844 phone screenshots are captured by dedicated sy-centralpark-review.spec.ts. Final results recorded after inspection below.

Final inspection: personally opened all four `sy-centralpark-final{,-front,-side,-top}.png` views and all four `sy-centralpark-rotated{,-front,-side,-top}.png` views (rotation π). Also opened actual desktop and 390×844 phone board screenshots, comparing with tier 10 bridge on the same board. Distinct planted high/low towers, cantilever clearance, roof mirror system and restrained balcony rhythm remain readable; no model clipping or unexpected intersections observed. Exact side elevation overlaps the towers as expected for their X separation. Pure overhead view hides the low mirror array beneath the upper reflector frame; the oblique view separates their heights.

Checks: dedicated geometry test passed; existing sy-opera and sy-harbourbridge geometry tests passed. Packs initially hit its default 5000ms timeout under concurrent rendering; rerun `npx vitest run tests/packs.test.ts tests/sy-centralpark.test.ts --testTimeout=30000` passed all 7 tests. No public test configuration changes. Both default and rotated model-preview runs passed.

`npm run typecheck` was run and failed only in unrelated existing files: tests/browser/ny-onewtc-preview.spec.ts lines 47–52 (nullable source/canvas context), tests/eiffel.test.ts line 17 (Factory called with 2 arguments). These files were left untouched. Model source diff whitespace check passed. No commit, push, publishing, Sites or hosting operations.

Product test rerun passed (55.6s). First attempt timed out waiting for atlas card stability during animated layout. Dedicated test now switches back to desktop viewport for gallery, disables gallery animation and scrolls directly; no product code changes. Personally opened `artifacts/sydney-review/sy-centralpark-catalog.png`: tier 09 / 512 identity correct, uncropped thumbnail, recognizable high/low towers and mirror frame. Product artifacts: `sy-centralpark-desktop.png`, `sy-centralpark-mobile.png`, `sy-centralpark-catalog.png`, all under `artifacts/sydney-review/`. Visual acceptance complete.
