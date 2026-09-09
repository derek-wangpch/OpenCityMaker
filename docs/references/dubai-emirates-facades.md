# Emirates Towers: finish the angled facades

2026-09-09, public OpenCityMaker; tier 9 / value 512. Scope is the two angled
shaft elevations of each tower. Existing height difference, triangular plan,
metal crowns, needles, palette and podium remain unchanged.

## Evidence and constraints

The user's rotated atlas screenshot shows large blue fields with only three
widely spaced horizontal bands. The code confirmed this was incomplete facade
articulation, not missing triangles. The model uses Y up, X width and Z depth;
its triangular plan vertices are shared by the shaft, crown and face placement.

- [NORR architect project](https://norrgroup.com/jumeirah-emirates-towers-office/):
  source description identifies silver aluminium and reflective silver/copper glass.
- [CTBUH building entry](https://www.skyscrapercenter.com/dubai/emirates-tower-one/311):
  describes triangular cross sections and metal/glass cladding.
- [ACA architecture archive](https://arab-architecture.org/db/building/emirates-tower):
  complementary building identification and prior project reference.

Reference-image browser attempts timed out on the NORR page and ACA image.
No new external photograph or orthogonal reference set was visually verified in
this follow-up. The user's screenshot is the direct visual evidence. Window
counts and mullion spacing are intentional game abstractions, not measured
facade reconstruction. Existing crown/plan approximations remain as documented
in `dubai-tier-review.md`.

## Changes

Each angled glass panel now has ten or eleven grouped window rows, divided by
one central metal mullion. Bands stay inside the glass-field width instead of
projecting beyond its edges. Glass, spandrels and mullion use successive shallow
surface offsets to avoid coplanar faces. Broad silver piers remain plain, as do
the solid sloped crowns. The front face retains its distinct single ribbon of
horizontal glazing. Tier 9 gets visible facade structure without individual
floor-by-floor windows or dense fine grids.

## Validation

- TypeScript check and existing Dubai geometry tests: pass (7/7).
- Default, front, side and top rendering: pass; all four images inspected.
- 390 × 844 product board plus four atlas rotations in both light and dark:
  pass (2/2); all eight atlas and both board screenshots inspected.
- No page errors or horizontal overflow. Physical devices and animated rain
  were not tested.

Artifacts: `artifacts/dubai-emirates-facades/elevations.png`, `rotations.png` and
`boards.png`. Capture test: `tests/browser/dubai-emirates-facades.spec.ts`.
