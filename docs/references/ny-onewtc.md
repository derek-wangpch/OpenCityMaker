# ny-onewtc (One World Trade Center / 世界贸易中心一号楼) — reference record

Tier 11 (value 2048). Rework of a loft that pinched to a diamond then bloated
back into an axis-aligned square, with only four corner ribs and a plain stick
antenna. Real building: SOM, Lower Manhattan, 1,776 ft / 541.3 m to tip,
completed 2014.

## Verified dimensions

| Feature | Real | Source |
|---|---|---|
| Height to tip | 1,776 ft / 541.3 m | SOM; CTBUH / Structurae |
| Roof / glass parapet | 1,368 ft / 417 m (steel band 1,362–1,368 ft = original Twin Towers) | SOM; Metals in Construction |
| Spire | 408–441 ft / ~124–135 m cable-stayed mast | SOM; Wikipedia; Structurae (135 m) |
| Plan at grade | 200 × 200 ft square (Twin Towers / memorial-pool footprint) | SOM; Metals in Construction |
| Parapet plan | 150 × 150 ft square, rotated 45° from the base | SOM |
| Podium | 185–186 ft / 56.7 m windowless concrete; 50 ft lobby + mechanical | Wikipedia; Czech height diagram; SOM |
| Mid-shaft plan | regular octagon | SOM |
| Facets | eight elongated isosceles triangles (four up, four down) | SOM |
| Observatory | floors 100–102, just under the parapet | SOM; Metals in Construction |
| Comms crown | three communication platform rings, then the mast + LED beacon | SOM; NAB / Durst briefing |

Form rule, from SOM and Metals in Construction: the midpoints of the base
square become the corners of the top square. Vertex paths are straight, so
the eight faces are planar triangles — not a stack of shrinking boxes, and
not a shaft that re-expands to an axis-aligned square.

## Image evidence (viewed, saved in `artifacts/ny-onewtc-ref/`)

- `wtc-2021.jpg` / `wtc-2021-cropped.jpg` — Commons `One World Trade Center Building (2021).jpg`, 16 Jun 2021. Near-front skyline elevation, ground to needle. Cubic podium; shaft sides stay nearly vertical (the 150/200 rotation does not pyramid the silhouette); eight-triangle crease readable as alternating light/dark facets; dark louver zone just under the parapet; three rings then a segmented tapering spire.
- `wtc-liberty-park.jpg` — `One World Trade Center viewed from Liberty Park.jpg`. Ground-adjacent 3/4. Confirms the ribbed glass-fin podium vs the curtain wall, and the inverted (downward) triangle on the near corner.
- `wtc-vesey.jpg` — Vesey Street, 30 Oct 2015. Street-level upward. Podium reads as a solid, vertically scored cube; cable-net lobby openings on the faces; shaft facets start immediately above it.
- `wtc-west-side.jpg` — from the West Side Highway. Distant face-ish elevation: almost parallel sides, dark mechanical band under a level parapet, long thin needle. Level roof — the upward photo taper is perspective, not a sloped crown.
- `wtc-looking-up.jpg` — worm’s-eye on a corner. Two triangular facets meeting at a sharp arris; full-floor glass grid; not used for slope (perspective).
- `wtc-antenna.jpg` — `Antenna on the top of One World Trade Center building.jpg`. Crown close-up: circular support / stacked comms rings, tapering segmented mast, guy system implied. 2014, built form.
- `wtc-diagram.png` — Commons `Popis mrakodrapu One World Trade Center.png` (annotated physical model, not a photo). Cross-check of podium 56.7 m, roof 417 m, ring, ~124 m mast, beacon. Evidence type: diagram.

Side elevation: identical to front (four-fold symmetry). Roof plan constrained by SOM’s 150 ft rotated square + circular rings; no separate aerial photo kept after a Commons 429 on the follow-up fetch. Marked inference: roof deck inside the parapet is a flat dark square, unseen from the street.

## Palette (from photos, softened to pack style)

- shaft glass: cool blue-silver, lighter than ICC, cooler than Empire limestone
- ridges / pewter spandrels: pale silver
- mechanical / observatory louvers: dark blue-grey, flush
- podium: muted steel-green grey with brighter vertical fins
- lobby cable-net: dark glass
- rings + mast: off-white steel

## Model mapping (podium 0.275 + shaft roof 2.02 + needle to 2.60)

- `section(t)` linearly interpolates the eight vertices from an axis-aligned
  square (half-width W) to a 45° square whose side is 0.75 × base (150/200).
  Two loft rings keep the faces planar. Crown side is 0.88 of the base
  (real 0.75) so the rotated square stays close in mass to the podium.
- Eight ridge beams sample the same vertices.
- Grouped pewter floor belts; one dark louver collar under the parapet
  (mechanical + observatory zone).
- Podium: cube + vertical fins + four cable-net portals.
- Three disc rings, telescoping mast, six stay cables, small beacon.

Chunked vs true slenderness (roof/base ≈ 6.8:1 real, ≈ 2.8:1 on the plot),
same family of compression as CWT / Zun / Khalifa. Ratios of podium/roof,
spire/total and top-side/base-side are held.

## Uncertainties

- Exact comms-ring diameters and count of mast segments: photo-estimated;
  three rings are documented, segment count is stylized.
- Sky lobby (64F) is not a strong exterior band in the elevations — omitted.
- Built podium is glass fins over steel slats (2011 prismatic-glass scheme
  was abandoned); fins are grouped, not 4,000.
- No inspected construction drawing of the north elevation; geometry from
  SOM’s written rule + built photos.
