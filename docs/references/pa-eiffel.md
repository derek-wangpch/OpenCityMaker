# pa-eiffel — Eiffel Tower / 埃菲尔铁塔

Tier 11 (value 2048). Factory: `src/scene/models/paris/pa-eiffel.ts`.
Models the **built tower** with the 2022 antenna (330 m), not Sauvestre’s
unbuilt bulbous campanile. Verified 2026-09-06.

## Model constraints

| Item | Constraint used by the model |
| --- | --- |
| Axes | Square plan, faces axis-aligned. `+z` is a face (Champ-de-Mars / Trocadéro). Default camera sees the `+x/+z` corner. Front and side elevations are the same; the tower is 4-fold symmetric. |
| Proportion | Published: 330 m to the antenna tip, 300 m iron, 125 m square base. Platforms at 57.63 / 115.73 / 276.13 m with face sides 70.69 / 40.96 / 18.65 m. Heights stay true; widths are widened ~1.18× so the four legs still read at board size. |
| Profile | Legs are **straight** from the pedestals to the first platform (published face inclination 65°48′). Then a concave gather to the second platform, where the four piles merge into one shaft. Above that the taper is gentle and nearly vertical. |
| Plan | Four square lattice piles at the corners of the 125 m square. Each pile keeps a ~15 m face from the ground to the first floor, then shrinks until the piles meet at the second floor. |
| Base | Four masonry pedestals. Four decorative arches (published rise 39 m, ~74 m diameter) spring from the inner faces of adjacent piles and crown well below the first platform — they are not structural. |
| Platforms | Three square decks. The first is the broadest (restaurants / gallery). The second is where the piles become one column. The third is a small observation lantern. |
| Crown | Current lantern house and broadcast antenna, not the 1889 flagpole campanile. |
| Lattice | Panel rhythm is grouped (not the real 29 panels) so the X-bracing reads at thumbnail size. |
| Material | Warm “Eiffel brown” iron. Stone only on the four pedestals. Matte blue-grey glass in the first-floor halls and the lantern. |

## Sources checked

- [Official monument — history](https://www.toureiffel.paris/en/the-monument/history) — pack source. Square 125 m base, 300 m iron tower, four lattice columns, Sauvestre’s decorative arches retained, wind-curve of the uprights.
- [Official education sheet — the tower in figures](https://www.toureiffel.paris/themes/custom/tour_eiffel/assets/Fiches/EN/en_10_la_tour_en_chiffres.pdf) — first floor 57 m, second 115 m, third 276 m; four pillars on a 125 m square.
- [Structurae — Eiffel Tower](https://structurae.net/en/structures/eiffel-tower) — platform heights 57.63 / 115.73 / 276.13 m; antenna tip 330 m (2022).
- [Wonders of the World — description](https://www.wonders-of-the-world.net/Eiffel-Tower/Description-of-the-Eiffel-tower.php) — 15 m constant pile face to the first floor; face inclination 65°48′49″; arches 74 m diameter; piles distinct to the second floor, then one column; masonry pedestals.
- [BnF Passerelles — Eiffel plates](https://passerelles.essentiels.bnf.fr/fr/chronologie/construction/86975eb3-9f28-4e1a-bc88-e28bbfab0a26-tour-eiffel/album/c2ed97d0-6861-4ebc-9760-06e4def9eff8-plans-gustave-eiffel-pour-tour-eiffel) — decorative arches rise 39 m and are non-structural.
- [Wikimedia Commons — front from Champ-de-Mars](https://commons.wikimedia.org/wiki/File:Paris_-_Eiffelturm_-_frontal_vom_Marsfeld.jpg) — near-front built elevation: spreading legs, arch below the first deck, three platforms, slender upper shaft, antenna. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Paris_-_Eiffelturm_-_frontal_vom_Marsfeld.jpg)
- [Wikimedia Commons — from Champ-de-Mars](https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg) — second near-front built photograph, same face. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Tour_Eiffel_Wikimedia_Commons.jpg)
- [Wikimedia Commons — from Trocadéro](https://commons.wikimedia.org/wiki/File:Vue_de_la_tour_Eiffel_depuis_le_Trocad%C3%A9ro.jpg) — opposite face (~180°, not a side). Confirms 4-fold symmetry: the two face elevations match. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Vue_de_la_tour_Eiffel_depuis_le_Trocadéro.jpg)
- [Wikimedia Commons — upward from the crossing](https://commons.wikimedia.org/wiki/File:Detail_of_the_first_level_of_La_tour_Eiffel_(21852680714).jpg) — four independent piles, square void, arches, first-floor soffit. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Detail_of_the_first_level_of_La_tour_Eiffel_(21852680714).jpg)
- [Wikimedia Commons — looking down](https://commons.wikimedia.org/wiki/File:Looking_down_from_Eiffel_Tower,_Paris,_France_2007.jpg) — one pile’s square lattice and the square plan. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Looking_down_from_Eiffel_Tower,_Paris,_France_2007.jpg)
- [Wikimedia Commons — Eiffel Plate VII](https://commons.wikimedia.org/wiki/File:Eiffel_Tower_plans_07.jpg) — 1889 metallic framework: 29 panels, decorative arch under the first floor, pile taper. Historic design evidence, not a 2022 survey. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel_Tower_plans_07.jpg)
- [Wikimedia Commons — Eiffel Plate XV](https://commons.wikimedia.org/wiki/File:Eiffel_Tower_plans_17.jpg) — upper part: lantern, arched gallery, mast. 1889 campanile, later replaced by antennas. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel_Tower_plans_17.jpg)
- [Wikimedia Commons — Rouillard summit section](https://commons.wikimedia.org/wiki/File:Le_sommet_de_la_Tour_Eiffel._Coupe_dessin%C3%A9ee_par_M._Rouillard.jpg) — 1889 lantern, balcony, and flagpole. Used only for the lantern massing idea; the model’s needle is the current antenna. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Le_sommet_de_la_Tour_Eiffel._Coupe_dessinéee_par_M._Rouillard.jpg)
- [English Wikipedia — Eiffel Tower](https://en.wikipedia.org/wiki/Eiffel_Tower) — 330 m (2022 antenna), 125 m base, three visitor levels.

## Stylization

Board-scale cartoon: 15 grouped lattice bays instead of 29, one iron family instead of the real three paint grades, restaurant halls as glass insets rather than pavilions. Widths opened ~18% so the four legs stay distinct next to the Arc de Triomphe tile. The first platform stays low (~1/5.7 of total height); that is the identity, not a thing to “balance.” The third deck and lantern are opened past the published 18.65 m so the crown still reads at board size.

## Remaining inference

- Face and opposite-face elevations were inspected. A true 90° side is identical by symmetry; no separate side drawing was required. Depth is taken from the upward/downward square-plan photos and the published square dimensions.
- Exact lantern and antenna cluster geometry after 1957/2000/2022 is simplified to a glass box, a small cap, and one needle.
- Pedestal height and the arch spring (~16 m) are estimated from the Champ-de-Mars photographs against the published 39 m crown and 74 m diameter.
- Interior stairs, lifts, and first-floor glass-floor renovation are omitted.

## Follow-up visual correction — 2026-09-06

This pass inspected the linked Champ-de-Mars photograph in the browser and
[Jeffrey Milstein's aerial photograph at Bau-Xi](https://bau-xi.com/products/14-paris-eiffel-tower)
([image](https://bau-xi.com/cdn/shop/products/Milstein-14_PARIS_Eiffel_Tower_crop-72.jpg?v=1603640589)).
The latter confirms the open first/second galleries, four separate piles and
square footprint. [Official figures](https://www.toureiffel.paris/en/the-monument/key-figures)
were rechecked for the overall width and three level heights. Earlier sources
above are retained from the existing reference record, not all re-inspected in
this pass. A second search did not supply an independent modern orthogonal side
photograph; side massing remains constrained by square-plan symmetry, not a
claimed separate side-photo match. A/B faces refer to model axes only.

- Fixed the second-platform shaft junction: its four posts now start at the full
  shaft corners, rather than using the half-width of a single lower pile. The
  previous geometry pinched to a narrow neck then widened in its next bay.
- Kept existing proportions, palette, four piles and three gallery heights.
- Opened the centers of the lower two decks, raised the previously buried glass
  halls above the first deck, and added sparse arch-to-gallery spandrel links.
- Gallery band width, glass hall placement and spandrel grouping are deliberate
  board-scale simplifications, not measured reconstruction.
- Previews: `artifacts/pa-eiffel/after.png`, `after-front.png`, `after-side.png`,
  `after-top.png`; product views: `desktop.png`, `mobile.png` in the same folder.

Validation: inspected front, side, default oblique and top renders. Focused
upper-shaft regression and thumbnail tests passed. Overall pack checks reached
an unrelated `ny-onewtc` height failure (2.670000076 > 2.66). Whole-project
TypeScript check reported existing errors in `ny-onewtc-preview.spec.ts` and
`db-emirates-debug.test.ts`, with no Eiffel diagnostic. Desktop product thumbnail
and mobile Paris silhouette were inspected; the completed-game overlay obscures
the desktop board. Rotated desktop/mobile model dialogs are checked separately.

The user subsequently accepted One WTC's antenna height. The pack test now
allows that model up to 2.70, requiring vertices above 2.66 to remain within
0.05 of the central axis. All six pack tests passed after this exception.
