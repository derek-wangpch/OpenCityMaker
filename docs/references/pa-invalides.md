# pa-invalides — Les Invalides / 荣军院 (Dôme des Invalides)

Tier 9 (value 512). Factory: `src/scene/models/paris/pa-invalides.ts`.
The pack models the **Dôme church** (Hardouin-Mansart, 1677–1708), not the
whole Hôtel hospital grid. Verified 2026-09-06.

## Model constraints

| Item | Constraint used by the model |
| --- | --- |
| Axes | `+z` is the south ceremonial facade (Place Vauban / frontispiece). `±x` are the east and west church facades. `−z` is the north side that joins Saint-Louis-des-Invalides in reality; the model keeps it as a plain square face and does not add the soldiers' nave. |
| Proportion | Published height is 107 m to the cross (≈90 m to the outer dome, lantern and fleur-de-lis spire above). Dome diameter is cited around 27–28 m. The square church plan is larger than the drum; width and depth stay independent and nearly equal. Exact square width is not published on the official sheets checked — estimated from elevations and the aerial roof plan. |
| Outline | Nearly square two-storey limestone body, terrace, two-level circular drum, gilded outer dome, lantern, tall thin spire and cross. |
| Front | Salient south frontispiece: two superimposed orders, four columns per storey, triangular pediment, central arched door. East and west repeat a shallower pedimented bay (each real facade has a porch and pediment). |
| Drum | Two unequal storeys. Lower storey: tall arched windows with paired columns. Eight buttresses are structurally paired on the diagonals; the model keeps eight window bays facing the cardinals and diagonals, with paired columns between them. |
| Dome | Twelve gilded compartments with ribs. Lead shell is fully gilded in the built state (1989 regilding). Trophy relief in the panels is omitted at board scale. |
| Crown | Gilded lantern (described as a square pavilion set on the diagonal) and a fleur-de-lis spire topped by an orb and cross. |

## Sources checked

- [Musée de l'Armée — The Dome (tomb of Napoleon)](https://www.musee-armee.fr/en/your-visit/museum-spaces/the-dome-tomb-of-napoleon.html) — official space page; pack source URL. Confirms Hardouin-Mansart royal chapel and later Napoleonic tomb. No measured drawings.
- [Musée de l'Armée — Église royale / Dôme presentation (FR)](https://www.musee-armee.fr/fileadmin/user_upload/Documents/Support-Visite-Fiches-Presentation/MA_fp-eglise-royale.pdf) — near-square terrace plan, salient south frontispiece, two superimposed orders, triangular pediment, two-level tambour, lantern with fleur-de-lis spire and cross, height “plus de 101 m”.
- [Musée de l'Armée — Dome presentation (EN)](https://www.musee-armee.fr/fileadmin/user_upload/Documents/Support-Visite-Fiches-Objets/Fiches-periode-louis-XIV/dome-presentation-GB.pdf) — same sequence in English; 101 m / 331 ft.
- [Wikimedia Commons — south facade](https://commons.wikimedia.org/wiki/File:Paris_D%C3%B4me_des_Invalides_facade_south_20140622.jpg) — near-front built photograph from the south. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Paris_Dôme_des_Invalides_facade_south_20140622.jpg)
- [Wikimedia Commons — ensemble from Place Vauban](https://commons.wikimedia.org/wiki/File:Paris_-_Dôme_des_Invalides_-_Vue_d%27ensemble_-_005.jpg) — more distant south elevation; square body vs drum vs dome vs lantern. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Paris_-_Dôme_des_Invalides_-_Vue_d'ensemble_-_005.jpg)
- [Wikimedia Commons — west of the Dôme](https://commons.wikimedia.org/wiki/File:Dôme_des_Invalides_002.jpg) — adjacent side ≈90° from the south front; paired drum columns, two drum storeys, pedimented church block. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Dôme_des_Invalides_002.jpg)
- [Wikimedia Commons — east facade close-up](https://commons.wikimedia.org/wiki/File:Dôme_des_Invalides_Est.jpg) — upward side view; same two-order stone body and ribbed gold dome. Too steep to treat as an orthogonal elevation. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Dôme_des_Invalides_Est.jpg)
- [Wikimedia Commons — aerial of the Hôtel](https://commons.wikimedia.org/wiki/File:Invalides_aerial_view.jpg) — roof plan of the Dôme as a square church south of the courtyard grid; confirms we should not model the hospital wings. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Invalides_aerial_view.jpg)
- [Wikimedia Commons — 1756 section (Pérau / Chevotet)](https://commons.wikimedia.org/wiki/File:Coupe_dome_et_hotel_invalides.png) — longitudinal section: triple-shell dome, tall outer silhouette, lantern and slender spire. Historic engraving, not a modern survey. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Coupe_dome_et_hotel_invalides.png)
- [Wikimedia Commons — lantern](https://commons.wikimedia.org/wiki/File:Roof_lantern_of_Dôme_des_Invalides.jpg) — gilt lantern, balcony, conical fleur-de-lis neck, orb and cross. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Roof_lantern_of_Dôme_des_Invalides.jpg)
- [French Wikipedia — Hôtel des Invalides](https://fr.wikipedia.org/wiki/Hôtel_des_Invalides) — Greek-cross-in-square plan; each facade two orders + pediment; dome 90 m, lantern to 107 m; eight drum buttresses paired on the diagonals; twelve gilded dome compartments.

## Stylization

Board-scale cartoon: fewer window bays, paired drum columns kept as simple cylinders, lantern reduced to a rotated gilt box and needle. Trophy relief, statues, volutes and the Saint-Louis nave are omitted on purpose.

## Remaining inference

- Published official sheets give height and the vertical sequence, not a surveyed square width. The model’s church width is an elevation estimate.
- East photograph is a low-angle close-up; the west Dôme shot plus the square plan constrain that side. North is inferred as the same square body without a free-standing porch.
- Lantern is simplified to a small gilt pavilion and needle. Statues, trophies, volutes and the connecting Saint-Louis nave are omitted.
- Height figures differ slightly across official French (101 m) and encyclopedia (107 m) sources; the silhouette uses the taller lantern-and-cross reading.
