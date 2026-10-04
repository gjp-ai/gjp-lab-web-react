# Arrays, sets & maps detailed design

Status: Implemented

Requirements: [Arrays, sets & maps](collections_requirement.md)

## Implementation goal

Each sample is a top-level function in `CollectionsSamples.ts` whose body is the code shown on screen; `CollectionsScreen` passes `collectionsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`CollectionsScreen.tsx`](../../../../../src/features/typescript/collections/CollectionsScreen.tsx) | Introduction |
| [`CollectionsSamples.ts`](../../../../../src/features/typescript/collections/CollectionsSamples.ts) | Samples in display order (Arrays, Sets, Maps, map, filter, and reduce, Copies are shallow) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptCollections` |

## Ownership and state

- `collectionsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptCollections`; pushes nothing.

## Deterministic output

Sets and maps iterate in insertion order, so every run logs the same lines without sorting.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Arrays, sets & maps: copies and insertion order"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: COL-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
