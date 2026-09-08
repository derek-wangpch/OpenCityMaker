# Creation record

CityMaker is a browser 2048 puzzle whose tiles are original, procedurally generated
Three.js buildings. Twelve cities each carry eleven architectural tiers, from vernacular
housing up to a recognizable landmark, for 132 models in total.

This document records how those models were made and what part an AI model played, so the
attribution can be checked against the repository rather than taken on trust.

## Model attribution

The procedural geometry for all 132 building models was generated with **GPT-6 Astra**.

This was not a single-prompt generation. Each building went through the reference-driven
workflow documented in
[`.agents/skills/building-reference-modeling/SKILL.md`](../.agents/skills/building-reference-modeling/SKILL.md),
which the repository ships as a reusable skill:

1. **Multi-view research.** Locate a near-front elevation, an adjacent side roughly 90°
   away, and an oblique or top view that establishes depth and roof form. Search under the
   building's local-language name as well as its English name. Prefer architect, owner and
   engineering sources over photography alone, and distinguish built structures from
   competition renders and superseded designs.
2. **Form constraints before geometry.** Record proportions, silhouette, crown, feature
   bands and facade rhythm from those views, separating real geometry from perspective
   artifacts. Anything not established by evidence is marked as inferred rather than
   invented as an exact dimension.
3. **Silhouette-first modeling.** Build massing before facade detail, with a detail budget
   scaled to the building's tier rather than to its real-world fame.
4. **Visual validation.** Render the model and compare it against the front and side
   references, then iterate. Deliberate stylization is recorded separately from uncertain
   geometry.

The result is deliberately stylized: proportions are compressed for readability at board
size, and the models are cartoon interpretations rather than reconstructions at real-world
dimensions.

This record covers the building models. It does not characterize authorship of the rest of
the codebase.

## What can be checked

| Claim                                            | Where to verify                                                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 132 models, 11 tiers × 12 cities                 | `src/scene/models/<city>/` — one factory module per building                                                                  |
| Models are procedural, not imported meshes       | Every factory builds geometry through the `ModelKit` in `src/scene/kit.ts`; the repository contains no mesh or texture assets |
| Each building names its architectural references | `src/cities/<city>/buildings/*.ts` — each entry carries at least one primary reference URL, enforced by `validatePacks`       |
| Reference liveness checks                        | [`docs/qa/reference-checks.json`](qa/reference-checks.json), including sources that blocked automated access                  |
| Model bounds and uniqueness are enforced         | `tests/` — model contract tests assert the plot and height limits and globally unique model keys                              |
| Verification coverage and known limitations      | [`QA.md`](../QA.md)                                                                                                           |

## Originality and rights

All 132 miniatures are authored as procedural geometry in this repository. No third-party
building meshes, model libraries, or textures are used.

Building, landmark, organization, and product names identify architectural references only.
Those names, trademarks, and designs belong to their respective owners; CityMaker is an
independent, unofficial project and is not affiliated with, endorsed by, or sponsored by
them. Reference links document the visual research behind the original interpretations and
do not grant rights to third-party photographs, trademarks, or architectural works.

The source code and the original procedural models are released under the
[MIT License](../LICENSE).
