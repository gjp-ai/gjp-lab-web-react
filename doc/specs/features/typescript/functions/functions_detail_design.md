# Functions & closures detailed design

Status: Implemented

Requirements: [Functions & closures](functions_requirement.md)

## Implementation goal

Each sample is a top-level function in `FunctionsSamples.ts` whose body is the code shown on screen; `FunctionsScreen` passes `functionsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`FunctionsScreen.tsx`](../../../../../src/features/typescript/functions/FunctionsScreen.tsx) | Introduction |
| [`FunctionsSamples.ts`](../../../../../src/features/typescript/functions/FunctionsSamples.ts) | Samples in display order (Default and optional parameters, Rest parameters and spread, Arrow functions, Closures capture variables, Functions as values) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptFunctions` |

## Ownership and state

- `functionsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptFunctions`; pushes nothing.

## Local functions

Every helper is declared inside the sample function, so the snippet is complete and runnable as shown.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Functions & closures: each closure keeps its own state"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: FUN-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
