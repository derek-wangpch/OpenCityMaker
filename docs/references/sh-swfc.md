# Shanghai World Financial Center reference record

Model: `sh-swfc` (Shanghai pack, tier 10, value 1024).

## The parti, and the mistake worth recording

KPF describe a square prism intersected by two arcs. The trap is to read that as
"the tower tapers", pick an axis, and shrink it. It does not taper. **The plan is a
square at every level; what changes is that two opposite corners are sliced away by
the arcs** — nothing at the ground, the whole corner by the roof. The plan therefore
runs square → hexagon → a thin strip lying on the _other_ diagonal.

Everything recognizable falls out of that one move:

- Across the sliced diagonal the tower is a flat-sided slab with a level roof, its
  full width at every level, crossed by the two slice edges sweeping from the foot
  of the slab out to its top corners.
- Across the surviving diagonal it is a blade, full width at the base and almost
  nothing at the crown.
- Viewed square-on to an original face it shows no taper at all.
- The sky portal is cut through the crown of the slab, and its jambs are the
  slivers of original square face left at the two surviving corners — thin blades
  that come to a point, which is why the jambs look so impossibly slender.

## The decisive photographic test

`sw_mid` (mid-height crop of the Wikimedia southwest elevation) shows **three**
vertical faces at once: a blue face that _widens_ going up, a broad golden face that
_narrows to a point_ at the top, and a third narrow face beyond it with its own
vertical arris.

A tower that merely tapers can never show three faces, and cannot show one face
widening upward. Sliced corners show exactly this: the widening face is a slice
surface growing from nothing at the corner, and the two others are original square
faces, the middle one eaten away to a point by the slice above it. Reconstructing
the view geometry from this, the camera sits ~17° off a square face normal, which
predicts the three band widths (56 / 382 / 121 px against 52 / ~380 / ~120 measured)
and the total silhouette (593 px predicted, 558 measured).

## Model constraints

| Item        | Constraint used by the model                                                                                                                                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Axes        | Model space puts the **sliced** corners on `z` and the **surviving** corners on `x`, so the plot's front elevation is the slab and its side elevation is the blade. Not verified compass directions.                                                                          |
| Proportion  | Published: 492 m architectural height, 487.4 m roof, square 57.95 m plan — so the widest dimension is the 82 m diagonal, and the slab elevation is 82 m wide, not 58 m. Model: 2.225 roof over a 0.70 diagonal. Taller than `sh-jinmao` (1.96 roof), below `sh-tower` (~2.5). |
| Section     | `\|x\| + \|z\| ≤ R` with the two `z` corners cut back to `\|z\| ≤ h(t)` — a square that becomes a hexagon and ends as a strip.                                                                                                                                                |
| Slice curve | `h(t) = R(1 − 0.82 t²)`. The quadratic is not a stylization: the measured silhouette fits a quadratic in height to under 1.5 px over a 220 px range, and its vertex lands at ground level, i.e. the slice opens tangent to the corner and bites hardest at the crown.         |
| Crown       | ~11 m thick against the 82 m roof length (`h(1) = 0.18 R`), matching the aerials' long narrow roof strip. Not a knife edge.                                                                                                                                                   |
| Portal      | Trapezoid, **wider at the top**, ~51 m in the 82 m roof, so the jambs are ~15 m — about 18% each side, which is what the crown photograph shows. Measured heights: sill ≈ 431 m, head ≈ 464 m, roof 487 m, so the head beam is a deep ~23 m band (94–101F, the Sky Walk).     |
| Roof        | Horizontal. Oblique photographs show the top edge sloping only because a horizontal line seen from below and off-axis recedes; the aerials confirm a level roof strip.                                                                                                        |
| Facade      | Three recessed equipment zones, each reading as a dark **double** line, at t ≈ 0.20 / 0.45 / 0.70 (detected at 0.42–0.45 and 0.70, spacing ≈ 0.25). Bright metal arrises on the surviving corners and the slice edges.                                                        |
| Mullions    | Placed at fixed plan positions, `z = min(h(t), R − x)`, so each rides the square face while the slice is outboard of it and bends onto the slice face where they meet. Spacing them as a fraction of face width instead fans them into a spider web — tried, rejected.        |
| Base        | Low stone podium skirt, upper step turned 45° with the tower. Retail base geometry omitted.                                                                                                                                                                                   |

## Measurement method

The Wikimedia southwest elevation has a clean flat sky, so silhouette edges were
extracted per scan row and the width fitted:

- `W(y) = 321.7 + 0.14477 y − 1.5472e−5 y²`, residuals < 1.4 px across y = 340…2540.
- Vertex y = 4678 → ground level → 4538 px for 487 m → 9.32 px/m.
- Under the sliced-corner section this is exactly `W = 58(cos φ + sin φ) − 116 sin φ · t²`,
  quadratic with its vertex at the ground — the observed form. Solving the measured
  end ratio (0.517) gives φ ≈ 17.7° off a square face and an independent scale of
  9.06 px/m, within 3% of the 9.32 px/m from the height fit.

## Sources checked

- [KPF — Shanghai World Financial Center](https://www.kpf.com/project/shanghai-world-financial-center) — architect page; the square prism / two arcs / sky portal parti.
- [Wikipedia — Shanghai World Financial Center](https://en.wikipedia.org/wiki/Shanghai_World_Financial_Center) — heights (492 / 487.4 / 474 m), 101 storeys, 57.95 m square plan, and the 2005 change from a 46 m circular opening to the built trapezoid.
- [Commons — evening light, Southwest view](https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_in_evening_light,_Southwest_view_20090906_1.jpg) — the frame the silhouette fit, the three-face test and the equipment-band detection all come from. [Direct image](https://commons.wikimedia.org/wiki/Special:FilePath/Shanghai%20World%20Financial%20Center%20in%20evening%20light,%20Southwest%20view%2020090906%201.jpg?width=1000)
- [Commons — March 9th 2024 (cropped2)](<https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_(March_9th_2024)_(cropped2).jpg>) — full-height built state ~90° round; the slice edge sweeping across the facade and the see-through portal. [Direct image](<https://commons.wikimedia.org/wiki/Special:FilePath/Shanghai%20World%20Financial%20Center%20(March%209th%202024)%20(cropped2).jpg?width=900>)
- [Commons — Top of the Shanghai World Financial Center](https://commons.wikimedia.org/wiki/File:Top_of_the_Shanghai_World_Financial_Center.jpg) — the trapezoid is unmistakably wider at the top; jamb-to-opening ratio read from here. [Direct image](https://commons.wikimedia.org/wiki/Special:FilePath/Top%20of%20the%20Shanghai%20World%20Financial%20Center.jpg?width=900)
- [Commons — 20191114 SWFC from Shanghai Tower-1](https://commons.wikimedia.org/wiki/File:20191114_SWFC_from_Shanghai_Tower-1.jpg) — near-plan aerial; roof as a long narrow strip, thin crown legs, sloped sill under the portal. [Direct image](https://commons.wikimedia.org/wiki/Special:FilePath/20191114%20SWFC%20from%20Shanghai%20Tower-1.jpg?width=1000)
- [Commons — Monolith swfc shanghai](https://commons.wikimedia.org/wiki/File:Monolith_swfc_shanghai.jpg) — steep upward view at a surviving corner: the vertical corner arris with a square face either side and a slice edge beyond each. Corroborates the section directly.
- [Commons — Shanghai World Financial Tower seen from Shanghai Tower](https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Tower_seen_from_Shanghai_Tower.jpg) — second aerial, cross-checks the roof strip.
- [Commons — Shanghai World Financial Center 200802](https://commons.wikimedia.org/wiki/File:Shanghai_World_Financial_Center_200802.jpg) — 2008 topping-out; same massing, used only as corroboration, not final-state evidence.

## Remaining inference

- No measured architect's elevation, section or roof plan was located. The section,
  the slice curve and the crown thickness come from photogrammetry on one clean
  elevation cross-checked against the aerials and the upward crown views — good
  estimates, not published values.
- The portal's trapezoid slope (jamb 0.72 R → 0.62 R) is eyeballed from the crown
  photograph; only "clearly wider at the top" is firmly supported.
- The sloped glazed sill and maintenance rails inside the opening are simplified to a
  flat bright sill band.
- Deliberate stylization, recorded separately from uncertain geometry:
  - The tower is shortened and widened to pack convention (~3.2:1 rather than 6:1).
  - The portal is **not** compressed with the rest. Scaling the measured sill would
    have given a letterbox slot that vanished at board size, so the sill was dropped
    to t 0.851 for a ~2:1 opening — short of the real 1.5:1, but the crown now reads
    as a frame around a hole at thumbnail size.
  - `h(1) = 0.18 R` rather than the ~0.13 R the fit suggests, so the crown survives
    as a mass instead of a fragile edge.
  - Window mullions are grouped into a coarse rhythm rather than drawn as a grid.
