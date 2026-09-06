# pa-notredame — Notre-Dame de Paris / 巴黎圣母院

Tier 7 (value 128). Factory: `src/scene/models/paris/pa-notredame.ts`.
The pack models the **restored built cathedral** (reopened December 2024),
including the reconstructed Viollet-le-Duc crossing flèche. The 2019 fire
destroyed the roof and flèche; the stone envelope survived. Verified 2026-09-06.

## Model constraints

| Item | Constraint used by the model |
| --- | --- |
| Axes | `+z` is the west facade facing the parvis. `−z` is the east chevet. `+x` is south (transept rose, Seine). |
| Proportion | Official: 127 m long × 48 m wide, west facade 43.5 × 45 m, towers 69 m, flèche 96 m, nave roof 43 m. Length is compressed to the 1.6 plot; facade width and heights stay independent. |
| Plan | Latin cross with double aisles, so the transept barely projects past the chapel line. Twin tower squares at the west; rounded chevet and ambulatory at the east. Sacristy omitted. |
| Front | Harmonic west facade: three portals (centre Last Judgment wider), Gallery of Kings band, 9.6 m rose, grande galerie colonnade, two unfinished square towers. |
| Towers | Flat-topped lead terraces with open balustrades. Two tall belfry bays per face. 13th-century spires were never built — do not add them. |
| Side | Steep lead nave roof, rhythmic flying buttresses, south transept gable with a large rose, crossing flèche taller than the towers. |
| Crown | Octagonal lead flèche at the crossing (Viollet-le-Duc, rebuilt 2023–24), not a tower spire. |
| Material | Warm Lutetian limestone, grey-blue lead roofs. Darker and less chalky than Sacré-Cœur; no gilt (that is Invalides). |

## Sources checked

- [Cathedral official — plans](https://www.notredamedeparis.fr/en/understand/architecture/plans/) — pack source family. Cloudflare blocked the page body; dimensions below also appear on the Friends mirror and Wikipedia.
- [Friends of Notre-Dame — layout](https://www.friendsofnotredamedeparis.org/notre-dame-cathedral/architecture/layout/) — 128 × 48 m, towers 69 m, facade 43.5 × 45 m, west rose 9.7 m, transept roses 13.1 m.
- [Official west-facade notes (search excerpt)](https://www.notredamedeparis.fr/en/understand/architecture/the-western-facade/) — unfinished square towers, rose 9.60 m, Gallery of the Virgin, lead terraces, intended tower spires never built.
- [English Wikipedia — Notre-Dame de Paris](https://en.wikipedia.org/wiki/Notre-Dame_de_Paris) — 128 × 48 m; towers 69 m; 2019 fire; restored outward appearance by 2024; flèche rebuilt to the 19th-century design.
- [French Culture Ministry — flèche rebuild](https://www.culture.gouv.fr/actualites/special-notre-dame-de-paris-4-6-le-jour-ou-la-cathedrale-a-retrouve-sa-fleche) — reconstructed flèche reaches 96 m; octagonal shaft, openwork storeys, 25 m needle.
- [Wikimedia Commons — west facade](https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_Notre-Dame_de_Paris_-_03.jpg) — near-front built photograph: twin towers, paired belfry bays, grande galerie, rose, Gallery of Kings. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Cathédrale_Notre-Dame_de_Paris_-_03.jpg)
- [Wikimedia Commons — west from the river, July 2025](https://commons.wikimedia.org/wiki/File:Notre_Dame_Cathedral_in_Paris_July_2025.jpg) — post-reopening west front; three portals, rose, unfinished towers. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Notre_Dame_Cathedral_in_Paris_July_2025.jpg)
- [Wikimedia Commons — southeast](https://commons.wikimedia.org/wiki/File:Paris_Notre-Dame_Southeast_View_01.JPG) — adjacent side ≈90° from the west: towers, nave, flying buttresses, transept, flèche, chevet. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Paris_Notre-Dame_Southeast_View_01.JPG)
- [Wikimedia Commons — south, 2017](https://commons.wikimedia.org/wiki/File:2017._Notre-Dame_de_Paris_from_the_south%27.jpg) — south elevation: nave flyers, south rose and gable, flèche vs tower height. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/2017._Notre-Dame_de_Paris_from_the_south'.jpg)
- [Wikimedia Commons — chevet](https://commons.wikimedia.org/wiki/File:Cathedrale_Notre-Dame_de_Paris_chevet.jpg) — east end: radiating flying buttresses, rounded apse, steep lead roof, flèche. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Cathedrale_Notre-Dame_de_Paris_chevet.jpg)
- [Wikimedia Commons — south rose and flèche](https://commons.wikimedia.org/wiki/File:Flèche_et_rosace_transept_sud_Notre-Dame_de_Paris.jpg) — transept gable, large rose, octagonal lead flèche. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Flèche_et_rosace_transept_sud_Notre-Dame_de_Paris.jpg)
- [Wikimedia Commons — Viollet-le-Duc plan](https://commons.wikimedia.org/wiki/File:Plan.cathedrale.Paris.png) — Latin cross, double aisles, shallow transept arms, chevet, south sacristy. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Plan.cathedrale.Paris.png)

## Stylization

Board-scale cartoon: fewer flyer bays, one clerestory rhythm, Gallery of Kings as a band, no statues / gargoyles / cresting. Towers stay flat-topped. Length is shortened so the west front still reads at full width.

## Remaining inference

- Official HTML was Cloudflare-blocked; dimensions are taken from the Friends mirror and Wikipedia, which quote the same official figures.
- Exact tower plan depth is not published as a single number; depth is estimated from the first two nave bays on the plan (~14–16 m).
- Chevet flyer count is reduced; radiating geometry is kept.
- The July 2025 west photo still shows a crane beside the cathedral; the stone west front and reconstructed flèche are the built form being modelled.
