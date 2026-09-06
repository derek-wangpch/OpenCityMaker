# pa-sacrecoeur — Sacré-Cœur / 圣心堂 (Montmartre)

Tier 8 (value 256). Factory: `src/scene/models/paris/pa-sacrecoeur.ts`.
The pack models the **built basilica** (Abadie 1875, campanile finished 1912–14),
not an unbuilt competition scheme. Verified 2026-09-06.

## Model constraints

| Item       | Constraint used by the model                                                                                                                                                                                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Axes       | `+z` is the south facade facing Paris (porch, stairs). `−z` is the north choir and campanile. `±x` are the east and west transept apses.                                                                                                                                                                                                 |
| Proportion | Wikipedia: 85 m long × 35 m wide × 83 m to the central cupola. Campanile cited 84 m (some lists 91 m). Postcard figures of 100 × 50 × 80 m likely include terrace and campanile. Plot forces the N–S axis to be compressed; width is slightly cartoon-widened so the south trio of domes still reads. Height and width stay independent. |
| Plan       | Greek cross: central rotunda, short south nave / porch, east–west transepts, north choir. Four smaller cupolas at the crossing corners; the south pair sit on the facade towers. Rounded apses on the choir and both transepts.                                                                                                          |
| Front      | Triple round-arched porch (Périgueux model). Two square towers with small ovoid cupolas. Monumental stair and terrace. Christ niche and equestrian statues omitted at board scale.                                                                                                                                                       |
| Domes      | One large elongated ovoid cupola on a windowed drum and lantern (the identity). Four smaller copies of the same profile. Not hemispheres and not onions.                                                                                                                                                                                 |
| Crown      | Square north campanile (Tour de la Savoyarde): staged shaft, arched belfry, small cupola and cross. Similar height to the central lantern.                                                                                                                                                                                               |
| Material   | Château-Landon travertine that reads chalk-white, warmer than Invalides limestone and without that church’s gilt dome.                                                                                                                                                                                                                   |

## Sources checked

- [Basilica official site (EN)](https://www.sacre-coeur-montmartre.com/english/) — pack source URL. Confirms the sanctuary and dome visit; no measured drawings.
- [English Wikipedia — Sacré-Cœur, Paris](https://en.wikipedia.org/wiki/Sacr%C3%A9-C%C5%93ur,_Paris) — 85 × 35 × 83 m; Greek-cross rotunda; elongated ovoid cupola surrounded by four smaller cupolas; north campanile 84 m.
- [French Wikipedia — Basilique du Sacré-Cœur de Montmartre](https://fr.wikipedia.org/wiki/Sacr%C3%A9-C%C5%93ur_de_Montmartre) — south porch of three round arches, terrace, campanile completed 1914.
- [Wikimedia Commons — south facade from the stairs](<https://commons.wikimedia.org/wiki/File:Paris_75018_Basilique_du_Sacr%C3%A9-C%C5%93ur_south_facade_stairs_20041107_(1).jpg>) — near-front built photograph: stair, triple porch, two tower cupolas, central drum and ovoid dome. [Direct](<https://commons.wikimedia.org/wiki/Special:FilePath/Paris_75018_Basilique_du_Sacr%C3%A9-C%C5%93ur_south_facade_stairs_20041107_(1).jpg>)
- [Wikimedia Commons — south facade from the butte](https://commons.wikimedia.org/wiki/File:2018-02-21_10-18-36_sacr%C3%A9-coeur-paris.jpg) — eye-level south elevation; terrace wall, porch, flanking cupolas, lantern. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/2018-02-21_10-18-36_sacr%C3%A9-coeur-paris.jpg)
- [Wikimedia Commons — roof-plan diagram](https://commons.wikimedia.org/wiki/File:Sacr%C3%A9-C%C5%93ur-de-Montmartre_plan_roofs.png) — schematic: central dome, four corner cupolas, south porch, north apse / campanile. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Sacr%C3%A9-C%C5%93ur-de-Montmartre_plan_roofs.png)
- [Wikimedia Commons — aerial](https://commons.wikimedia.org/wiki/File:Sacr%C3%A9_Coeur_-_Aerial_photo_1.jpg) — built roof plan: quincunx of cupolas, south pair toward the porch, square campanile at the north end. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/Sacr%C3%A9_Coeur_-_Aerial_photo_1.jpg)
- [Wikimedia Commons — west / north-west with campanile](<https://commons.wikimedia.org/wiki/File:Paris,_Sacr%C3%A9_Coeur,_Au%C3%9Fenansicht_(7).jpg>) — adjacent side ≈90° from the south front: square campanile, rounded choir chapels, central drum behind. [Direct](<https://commons.wikimedia.org/wiki/Special:FilePath/Paris,_Sacr%C3%A9_Coeur,_Außenansicht_(7).jpg>)
- [Wikimedia Commons — historic west view with Savoyarde inset](https://commons.wikimedia.org/wiki/File:PARIS_-_La_Basilique_du_Sacr%C3%A9-Coeur_de_Montmartre_et_la_Savoyarde.jpg) — campanile as a tall staged square tower beside the dome cluster. Historic print, not a survey. [Direct](https://commons.wikimedia.org/wiki/Special:FilePath/PARIS_-_La_Basilique_du_Sacr%C3%A9-Coeur_de_Montmartre_et_la_Savoyarde.jpg)
- [Wikimedia Commons — west facade category](https://commons.wikimedia.org/wiki/Category:West_facade_of_the_Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre) — confirms the west elevation is the long N–S side, not a second ceremonial front.

## Remaining inference

- Official pages do not publish a surveyed square width of the crossing. Width / depth on the plot are elevation estimates, with N–S compressed to fit 1.6.
- Campanile height differs across sources (84 m vs 91 m); the silhouette keeps it level with the central lantern.
- South-from-below photos hide the campanile behind the main dome; the west view is the evidence for that tower.
- Statues, gargoyles, mosaic, and the hillside retaining arcade are omitted. The stair is a short plot-scale hint, not the full Louise-Michel cascade.
