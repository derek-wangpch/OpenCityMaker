# bj-courtyard — 北京四合院 (Siheyuan courtyard)

Tier 3 (value 8). Factory: `src/scene/models/beijing/bj-courtyard.ts` → `courtyard`
in `src/scene/models/beijing/shared.ts`. Verified 2026-09-06.

## Type and layout (text references; a type building, not one address)

Standard single-court (一进) Beijing siheyuan — 正房/倒座房/东西厢房 around one
court, each an independent single-storey range with its own roof, enclosed by
walls, gate in one corner:

- [Wikipedia: 四合院](https://zh.wikipedia.org/zh-cn/%E5%9B%9B%E5%90%88%E9%99%A2) —
  ranges are freestanding; 垂花门 divides 一进 from 二进 courts (so no 垂花门 in a
  single-court house); gate placement and 影壁.
- [学习强国: 四合院之美中国独有](https://www.xuexi.cn/lgpage/detail/index.html?id=6032106367036623848) —
  definition: 正房、倒座房、东西厢房 around one court, 影壁 shape.
- [光明网: 北京四合院](https://news.gmw.cn/2017-03/10/content_23932758.htm) —
  ① central axis; ② 正房/倒座/两厢 all single-storey and freestanding;
  ③ 山墙到顶 (gable walls full height → 硬山 roofs, not hip roofs).
- [Baidu Baike: 四合院](https://baike.baidu.com/item/%E5%9B%9B%E5%90%88%E9%99%A2/2930995) —
  gate in the south-east 巽 corner; hierarchy of ranges.
- [中四合院规格 (世界华人联合会)](https://cn.wtcf.org.cn/qqhb/cjwx/cjwx/djyw/djyw/201608/16/2077131513446556115.html) —
  北房 5 间 (3 正 2 耳), wings 3 间 each → the 3-bay + 2 耳房 arrangement encoded.

## Features the model encodes (and their evidence)

| Feature | Evidence |
|---|---|
| Four freestanding ranges, 硬山 gable roofs, ridges 正房/倒座 E–W and wings N–S | 光明网 ③, all plan sources |
| Height hierarchy 正房 > 厢房 > 倒座房, 耳房 closing the north corners | 中四合院规格, Baidu Baike |
| Blank grey-brick walls to the lane; plaster + painted timber/lattice only inside | all sources (四合 definition; the "courtyard hidden behind walls" trope) |
| Gate in the south-EAST corner bay, stepping above and forward of the south range | Baidu Baike (大门位于东南角巽位) |
| 影壁 screen wall angled just inside the gate | Wikipedia, 学习强国 |
| 十字甬路 cross paving, paired trees in front of the 正房, 鱼缸 | common courtyard furnishing; generic |

Model axes: +z = south (all ranges face the court at −z…+z across it),
+x = east, so the gate sits at +x — mirrored there this session from −x
(previously south-west, contradicting the 巽位 rule). Pure mirror; no other
geometry touched.

## Stylization (deliberate, not uncertain)

- Single-court layout (一进) chosen to fit the 1.6×1.6 plot; deeper compounds
  repeat these ranges.
- Bay counts fixed at 3 (north 3 + 2 耳房); roofs take the city palette tone
  rather than grey barrel tile; 门簪/门墩 reduced to single blocks.
- 垂花门 correctly absent (belongs to 二进+ houses).

## Remaining inferences

- Proportions (range depths 0.26–0.4, heights 0.24–0.36) are compositional,
  not from a surveyed plan; no single elevation drawing was used.
- Exact gate type simplified to a generic 屋宇式 roofed gate.

## Screenshots (artifacts/)

`bj-courtyard-check{,-front,-side,-top}.png` (final), `bj-courtyard-rot.png`
(rotated oblique), `bj-courtyard-thumb.png` (board-size), `bj-hutong-neighbor.png`
(tier 2), `bj-gate-neighbor.png` (tier 4).
