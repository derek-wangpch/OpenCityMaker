# bj-zun (中国尊 / CITIC Tower) — reference record

Tier 11 (value 2048). Rework of the 18-box stacked factory, which faked the smooth
waist with stepped ledges. Real building: KPF + Arup, Beijing CBD, 528 m, 108 floors,
completed 2018.

## Verified dimensions

| Feature | Real | Source |
|---|---|---|
| Height | 528 m | KPF project page |
| Plan | square with rounded corners ("倒圆角的正方形") | KPF; archcollege |
| Base width | 78 m | KPF, gooood, archcollege (all agree) |
| Waist width | 54 m at ≈385 m elevation (≈73 % of height) | KPF; archcollege (structural section) |
| Top width | 69 m | KPF (archcollege's overview says 59 m — internally inconsistent there; KPF's 69 m preferred) |
| Crown | "内尊" inner-zun sculptural crown, bespoke aluminium ribs | archcollege (structural), gooood (interior ribs) |
| Equipment floors | louvered dark bands, ≈6 up the shaft + a row at the crown base; transfer trusses at 8 equipment/refuge levels | photos zun-2018, zun-corner; archcollege (8 trusses) |
| Facade | dense vertical fluting ("fluted, outward drape" per KPF); 128 curtain-wall segments per face per strengthened section (far too fine to model — grouped into a rhythm) | KPF; archcollege |

## Image evidence (all viewed, saved in `artifacts/bj-zun-ref/`)

- `zun-2018.jpg` — Wikimedia Commons `China Zun 05-11-2018.jpg` — near-front elevation,
  ground to crown. Profile: trumpet foot flare over the bottom ≈6 % of height, concave
  sweep to the waist at ≈73 %, convex flare to the crown. Six dark louver bands at
  roughly even intervals ≈0.19/0.33/0.44/0.57/0.68/0.87 of height, then the crown zone.
  Crown top edge is a saddle: corners rise, face centres dip.
- `zun-corner.jpg` — `China Zun and Samsung China Headquarters.jpg` — near-front,
  slightly oblique. Confirms band count, rounded corners wrapping highlight, pale
  silver-green glass with bright vertical fins.
- `zun-head.jpg` — `China Zun head.jpg` — crown closeup, 3/4. Louver vent row at the
  crown base; crown zone fins denser and warmer (cream) than the shaft; saddle lip
  curls outward, dip at face centres ≈10–15 % of tower width at top. Level-check:
  the dip is real (both corners up, face centre down in one photo, not perspective).
- `zun-300x.jpg` — `China Zun from 300X (20180628141217).jpg` — ground-level frontal.
  Foot flare reads clearly against the sky; base meets a low stone plaza, no true
  podium block; entry canopy folds out low from the base.
- `zun-2020-full.jpg`, `zun-2021-full.jpg` — telephoto from neighbouring towers;
  confirm profile from a second vantage and the outward-curling lip from below.

Side elevation: identical to front (square symmetric plan) — confirmed by the two
oblique views showing the same profile on the adjacent face. No separate roof-plan
photo found; roof constrained as flat deck inside the saddle parapet (crown closeup +
KPF "inner zun" crown description). Marked inference: no mast; tiny beacon only, omitted.

## Palette (from photos, softened to pack style)

- glass: pale silver-green, lighter and greener than CWT's blue-grey
- fins/mullions: bright silvery, reading as continuous flutes
- louver bands: dark blue-grey, flush
- crown fins: warm cream (catches sun in zun-head)
- plaza: pale stone

## Model mapping (2.40 shaft + crown lip ≈ 2.45, under the 2.65 cap)

- halfWidth(t) = HW_BASE × profile(t): concave power curve to the waist at t=0.73
  (0.692 of base width), convex power flare to the top (0.885), trumpet foot +8 %
  over the bottom 6 %.
- Chunked vs true scale (~1.5×) to match the pack family (CWT occupies similar plot
  share at grade); waist/base and top/base ratios held exactly at 0.692 / 0.885.
- Ring: 16-point superellipse (exponent 4) = rounded square; flutes = 16 beam chains
  sampling the same profile.
- Bands: 6 flush mech collars at photo heights + crown vent row; lip = custom loft
  whose top ring has corner vertices high and face-centre vertices low (the saddle).

## Uncertainties

- Roof interior unseen (no aerial/roof photo located): flat dark deck is an inference.
- Exact band elevations vary by source; photo-estimated fractions used.
- Crown zone fin density simplified to the shared flute rhythm, denser only by tone.
