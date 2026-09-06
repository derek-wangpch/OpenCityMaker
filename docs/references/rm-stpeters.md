# rm-stpeters — St Peter’s Basilica / 圣彼得大教堂 (Vatican)

Tier 11 (value 2048). Factory: `src/scene/models/rome/rm-stpeters.ts`.
The pack models the **built basilica** (Maderno nave and facade 1612–14,
della Porta / Fontana dome 1588–93, Bernini piazza 1656–67), not
Michelangelo’s unbuilt Greek-cross scheme. Verified 2026-09-06.

## Model constraints

| Item | Constraint used by the model |
| --- | --- |
| Axes | `+z` is the east facade facing St Peter’s Square / Rome. `−z` is the west apse. `±x` are the north and south transepts. Compass is the built orientation, not a guess. |
| Proportion | Wikipedia / Structurae: church 220 m long × 150 m wide × 136.6 m to the cross. Facade 114.69 m × 45.55 m. Vatican figures: floor to cross 133.3 m, dome exterior diameter 58.9 m. The piazza oval is ~240 m across. Plot forces a hard E–W squeeze: colonnade + nave share 1.6, so church depth is compressed more than width. Height and width stay independent. |
| Plan | Latin cross: Michelangelo’s crossing, transepts and west apse, plus Maderno’s three-bay nave and narthex. Two smaller cupolas sit on the east corners of the crossing (the pair that reads from the square). |
| Front | Maderno’s wide travertine facade: giant Corinthian order, central pediment, attic and statue balustrade, slightly tower-like end bays with clocks. Steps up from the square. Dome and the two cupolas rise behind; Maderno’s nave hides the lower drum from a true east elevation. |
| Colonnade | Bernini’s two elliptical arms (four-row Tuscan columns in reality, two rows here) open toward the via. Egyptian obelisk at the oval centre; two fountain discs at the foci. |
| Dome | Raised ogival “Cupolone” on a tall drum with paired columns and pedimented windows. Sixteen ribs (real count). Lantern, gilt ball and cross. Lead shell, travertine ribs — not a gilt Invalides dome and not a hemisphere. |
| Crown | Lantern with its own colonnette ring, small cupola, ball and cross. |
| Material | Travertine cream, warmer than Sacré-Cœur chalk and cooler than the Colosseum’s ochre. Dome reads pewter / lead-grey. Colonnade roof is terracotta. |

## Sources checked

- [Official basilica site (EN)](https://www.basilicasanpietro.va/en) — pack source URL. Confirms dome visit and square; no measured drawings.
- [Holy See — Dome and Lantern](https://www.vatican.va/content/vatican/en/ra/cupolone-lanterna.html) — exterior height 133.30 m to the cross; exterior diameter 58.90 m; interior 41.50 m; lantern globe and cross.
- [English Wikipedia — St. Peter’s Basilica](https://en.wikipedia.org/wiki/St._Peter%27s_Basilica) — 220 × 150 × 136.6 m; facade 114.69 × 45.55 m; Latin cross after Maderno’s nave; oval + trapezoid piazza; 13 facade statues.
- [Structurae — Saint Peter’s Basilica](https://structurae.net/en/structures/saint-peter-basilica) — 220 / 150 / 136.6 m; nave height 46.2 m.
- [Wikimedia Commons — east facade (2021)](https://commons.wikimedia.org/wiki/File:St_Peter%27s_Basilica_fa%C3%A7ade.jpg) — near-front built photograph: giant order, inscription frieze, central pediment, attic, statue line, steps. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/St_Peter%27s_Basilica_façade.jpg)
- [Wikimedia Commons — Via della Conciliazione](https://commons.wikimedia.org/wiki/File:Via_della_Conciliazione_Vatican_St_Pieter_Basilica.jpg) — distant east elevation: wide facade, ribbed dome, two secondary cupolas flanking the drum. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Via_della_Conciliazione_Vatican_St_Pieter_Basilica.jpg)
- [Wikimedia Commons — from a roof over the square](https://commons.wikimedia.org/wiki/File:View_of_saint_Peter_basilica_from_a_roof.jpg) — oblique east: colonnade terracotta roof and saint statues, facade pediment, drum with paired columns, dome and lantern. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/View_of_saint_Peter_basilica_from_a_roof.jpg)
- [Wikimedia Commons — from the Gianicolo](https://commons.wikimedia.org/wiki/File:Roma_Basilica_di_San_Pietro_vista_dal_Gianicolo.jpg) — adjacent side ≈90° from the east front: 16-rib dome, paired-column drum, one secondary cupola, Michelangelo attic. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Roma_Basilica_di_San_Pietro_vista_dal_Gianicolo.jpg)
- [Wikimedia Commons — from the Vatican Railway (south)](https://commons.wikimedia.org/wiki/File:Dome_of_Saint_Peter%27s_Basilica_from_the_Vatican_Railway.jpg) — south skyline: drum windows with alternating pediments, 16 ribs, lantern, secondary cupola. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Dome_of_Saint_Peter%27s_Basilica_from_the_Vatican_Railway.jpg)
- [Wikimedia Commons — airplane oblique (2026)](https://commons.wikimedia.org/wiki/File:Aerial_view_from_airplane_in_2026.01.jpg) — roof plan: Latin-cross church, elliptical colonnade, obelisk, Via della Conciliazione axis. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Aerial_view_from_airplane_in_2026.01.jpg)
- [Wikimedia Commons — south secondary cupola](https://commons.wikimedia.org/wiki/File:0_Petite_coupole_m%C3%A9ridionale_-_St-Pierre_(Vatican).JPG) — smaller ribbed cupola with lantern, seen from the main dome. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/0_Petite_coupole_méridionale_-_St-Pierre_(Vatican).JPG)

`File:Basilica Sancti Petri 07.jpg` is a Vatican wall / administrative block, not the basilica — unused.

## Stylization

E–W depth of church and piazza is compressed to the plot; facade stays the full ceremonial width. Colonnade is two rows, not four. Facade bays and drum pairs are thinned so they read at board size. Thirteen attic statues become short posts. Fountain sculpture is two discs.

## Remaining inference

- Official pages do not publish a surveyed piazza ellipse; colonnade reach is an elevation estimate sized to leave a via opening.
- Facade height citations differ (45.55 m Wikipedia vs 48 m visitor pages); the model follows the attic-and-statue stack rather than a single number.
- West apse massing is inferred from the aerial and the Gianicolo side, not from a measured west elevation.
- The two eastern crossing cupolas are the pair encoded; further roof cupolas are omitted.

## 2026-09-06 本轮调整与复核

本轮重新打开上述正面局部、Gianicolo 侧面、2026 航拍，另补 [广场近正面全景](https://www.encirclephotos.com/image/st-peters-basilica-view-from-st-peters-square-in-rome-italy/) / [图片](https://www.encirclephotos.com/wp-content/uploads/Italy-Rome-St-Peter-s-Basilica-St-Peter-s-Square.jpg)。本轮未重新验证前文所有精确尺寸；模型不依赖它们。

Tier 11 高等级细节：保留主穹顶的 16 条肋、灯亭、双小穹顶、立面柱式与雕像节奏。把原来的拉高半球换成连续尖拱圆弧旋转曲面；肋条共享同一截面，避免悬空。钟面转向 +z 并加入简化指针；柱廊直线段与椭圆段端点连续。增加中殿坡屋顶、横翼圆形端部和稀疏侧窗。

尖拱曲线、圆形横翼和窗口分布属于照片指导下的游戏概括，未按测绘复原；教堂进深与广场仍有意压缩。省略细雕塑、屋面设备、密集窗饰。与 Rome tier 9–10 保持同一暖色石材风格。

本轮已检查正面、侧面、顶部与默认斜视，并在真实图鉴检查缩略图和手机宽度显示。截图：`artifacts/screenshots/rome-stpeters{,-front,-side,-top}.png`。
