# Dubai early-tier readability — 2026-09-09

Scope: public OpenCityMaker, tiers 1, 2 and 4. The screenshot contains four
building types; the three sharing wind towers were interpreted as the requested
lookalikes. Tier 3's timber-roofed souk is retained as a comparison. IDs, tier
values, discovery text and saved-game contracts remain unchanged.

## Shape decisions

Y is up, X is facade A width, Z is depth. No geographic orientation is claimed.
All geometry stays within the existing 1.6-unit plot and height envelope.

| Tier | Identity and silhouette                                                                                            | Detail budget                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1    | Compact house, one subdued sand-coloured barjeel with dark openings; tower width 0.28 and height 0.40 above the roof | Lowest: one door, two windows, no poles or ornament                                                   |
| 2    | Broad low courtyard ring, large sky opening and prominent green palm; no competing rooftop tower                   | Low: four simple wings, real through entrance, six coarse fronds                                      |
| 4    | Four stepped ochre houses, two separated rear barjeels, cross alley, flat terrace parapets and one side stair      | Moderate: sparse doors/windows and tower cross-poles; remove tiny crenellations, huts and third tower |

Tower reduction, courtyard widening, lower wings and simplified palm are
intentional game proportions. Tier 2 represents a generic courtyard home, not a
specific Al Fahidi house with its wind tower removed. Tier 4 is a neighbourhood
abstraction, not a surveyed block. The four-house plan, tower placement and stair
location are designed for the board. No exact reconstruction is claimed.

## Reference evidence

English and Chinese searches covered wind towers, Al Fahidi courtyard houses,
elevations and aerial/roof plans. A second focused search sought missing plan
views. The following three photographs were opened and visually inspected in the
browser during this change (the text-fetch service returned 403 for the last two,
but their images loaded successfully in Chrome):

- [Al Fahidi tour source](https://travelindigenous.com/packages/al-fahidi-historical-neighbourhood-and-grand-souk-tour/):
  [courtyard / adjacent facades photograph](https://travelindigenous.com/wp-content/uploads/2024/02/al-fahidi-and-grand-souk-15-1536x2048.jpg).
  Built-condition photograph; long dark barjeel openings, square horizontal caps,
  solid lower tower shafts and staggered flat roofs. Supports tiers 1 and 4.
- [Sheikh Saeed house photography](https://www.traveladventures.org/continents/asia/sheikh-saeed-al-maktoum-house15.html):
  [courtyard view](https://www.traveladventures.org/countries/united-arab-emirates/images/sheikh-saeed-al-maktoum-house15.jpg).
  Built-condition photograph; broad open court, low wings, contrasting shaded
  openings and unequal tower heights. Used as regional courtyard vocabulary,
  not as the identity or measured layout of tier 2.
- [Side terrace detail](https://www.traveladventures.org/countries/united-arab-emirates/images/sheikh-saeed-al-maktoum-house10.jpg):
  built-condition photograph of stairs, flat parapets and timber-supported edges.
  Supports the roof-access vocabulary of tier 4, not its exact stair position.

[Al Fahidi guide booklet](https://www.tourguidetraining.ae/pluginfile.php/1/block_exalib/item_file/5/Al%20Fahidi%20Booklet%20ENG.pdf)
was read as text for barjeel and alley descriptions, but its browser image did
not load; it is not counted as visual plan evidence. A Wikimedia wind-tower
search result identified a palm-frond museum house and was excluded from the
masonry reference set.

No complete orthogonal facade pair or usable surveyed roof plan was visually
verified after the two search rounds. Depth and plan are therefore inferred from
courtyard obliques and the game type, with deliberately independent X/Z sizes.
Photos are not bundled in the product.

## Validation

- TypeScript check passes; existing Dubai geometry tests pass (6/6), including
  plot bounds, finite geometry, tier-2 entrance and low-tier triangle budgets.
- Four-view render checks pass for tiers 1–4 (4/4): default, front, side and top.
  All 16 views were inspected in the comparison sheet, including unchanged tier 3.
- Phone product review passes (1/1); all eight default/rotated atlas screenshots
  and the board screenshot were visually inspected. It uses a crowded 390 × 844 board containing only tiers 1–4,
  then opens and rotates all four atlas models. See the generated screenshots.
- Artifacts: `artifacts/dubai-readability/`; reusable capture test:
  `tests/browser/dubai-readability.spec.ts`. These are browser-size checks, not
  physical phone or WeChat verification.
