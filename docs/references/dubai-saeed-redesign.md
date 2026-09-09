# Sheikh Saeed House: a clearer tier upgrade

2026-09-09, OpenCityMaker. The user screenshot compares Al Fahidi neighbourhood
with Sheikh Saeed House: repository tiers 4 and 6 (values 16 and 64), rather than
3 and 5. This revision changes only the higher-tier house's geometry and its
three localized descriptions. Earlier tier 1/2/4 changes remain intact.

## Reference and shape constraints

X is facade A width, Y is up, Z is depth. No cardinal directions are assigned.
The footprint stays within the existing plot. Horizontal roofs, four square
barjeels and an open court remain the identity constraints. Broad plaster borders,
long recessed tower openings, timber cross-poles, an arched entrance and a
recessed two-level gallery make the higher tier richer through visible forms.

- [ACA architecture archive](https://arab-architecture.org/db/building/sheikh-saeed-al-Maktoum-house-now-used-as-a-museum):
  source text describes two levels around a central court and four wind towers.
- [Boris Kester courtyard source](https://www.traveladventures.org/continents/asia/sheikh-saeed-al-maktoum-house06.html)
  and [photograph 06](https://www.traveladventures.org/countries/united-arab-emirates/images/sheikh-saeed-al-maktoum-house06.jpg):
  opened and visually inspected in Chrome for this redesign. Built-condition
  courtyard oblique shows tall framed wind openings, horizontal tower caps,
  plaster-framed arcade bays, raised gallery access and terrace balustrades.
- [Courtyard photograph 15](https://www.traveladventures.org/countries/united-arab-emirates/images/sheikh-saeed-al-maktoum-house15.jpg)
  and [side/stair photograph 10](https://www.traveladventures.org/countries/united-arab-emirates/images/sheikh-saeed-al-maktoum-house10.jpg):
  inspected earlier in this same task; complement the court view with adjacent
  wings, flat parapets, stairs and timber-supported terrace edges.
- A second search sought courtyard plans and sections, including
  [The Sustainable City XIII paper](https://www.witpress.com/Secure/elibrary/papers/SC19/SC19005FU1.pdf).
  Search results are not counted as visually inspected drawings.

The references do not supply an independently verified orthogonal facade pair
or complete roof plan. Exact wing depths, four-corner tower placement, three-bay
loggia and stair placement remain game-layout approximations. The old code's
unverified claim to follow a particular 1991 plan has been removed.

## Tier budget and intentional exaggeration

Tier 6 is a middle-tier landmark. It should be a clear visual reward over the
small neighbourhood cluster, without the detail density of tiers 9–11.

- Four broader wind towers use light plaster frames, recessed panels and two
  coarse timber pole levels; omit decorative carving and fine shutter lattices.
- Enlarge arcade openings and separate them from the rear wall to create depth.
- Broaden the wings, raise the rear gallery and give the entrance a real opening.
- Keep sparse, broad parapet accents and a simple timber rail. No dense windows,
  photographic textures, extra domes or invented spires.
- Light sandstone and pale trim improve separation in dark mode without adding
  artificial glow or changing the scene lighting.

## Validation and previews

Type checks and all seven Dubai geometry tests pass, including a new check for the open
entrance and sky court. Existing bounds checks cover all eleven Dubai models.

Default/front/side/top captures cover tiers 4–6. Product tests use a crowded
390 × 844 board, then open and rotate tiers 4–6 in light and dark mode (2/2 pass).
All 12 elevation images, 12 atlas images and both board screenshots were visually
inspected. Generated
artifacts live in `artifacts/dubai-saeed-redesign/`. Physical devices, animated
rain and precise historical reconstruction are outside this validation.
