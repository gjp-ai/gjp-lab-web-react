# Iterators & generators detailed design

Status: Implemented

Requirements: [Iterators & generators](iterators_requirement.md)

## Implementation goal

Each sample is a top-level function in `IteratorsSamples.ts` whose body is the code shown on screen; `IteratorsScreen` passes `iteratorsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`IteratorsScreen.tsx`](../../../../../src/features/typescript/iterators/IteratorsScreen.tsx) | Introduction |
| [`IteratorsSamples.ts`](../../../../../src/features/typescript/iterators/IteratorsSamples.ts) | Samples in display order (for…of and iterables, Generators, Lazy, infinite sequences, Custom iterables, Destructuring and Array.from) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptIterators` |

## Ownership and state

- `iteratorsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptIterators`; pushes nothing.

## Infinite but safe

`naturals()` never ends, but `take()` stops asking after five values, so the sample finishes immediately.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Iterators & generators: values on demand"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: ITR-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
