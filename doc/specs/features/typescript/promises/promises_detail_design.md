# Promises & async/await detailed design

Status: Implemented

Requirements: [Promises & async/await](promises_requirement.md)

## Implementation goal

Each sample is a top-level function in `PromisesSamples.ts` whose body is the code shown on screen; `PromisesScreen` passes `promisesSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`PromisesScreen.tsx`](../../../../../src/features/typescript/promises/PromisesScreen.tsx) | Introduction |
| [`PromisesSamples.ts`](../../../../../src/features/typescript/promises/PromisesSamples.ts) | Samples in display order (async and await, Promise.all, Promise.allSettled, Cancellation with AbortController, The event loop) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptPromises` |

## Ownership and state

- `promisesSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptPromises`; pushes nothing.

## Async samples

These sample functions are `async`; the card awaits them, so **Run** shows "Running…" until they finish. Timing is only compared against a generous limit, so the output is the same every run.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Promises & async/await: results do not depend on timing"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: PRM-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
