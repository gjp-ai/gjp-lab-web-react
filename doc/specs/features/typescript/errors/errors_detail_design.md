# Error handling detailed design

Status: Implemented

Requirements: [Error handling](errors_requirement.md)

## Implementation goal

Each sample is a top-level function in `ErrorsSamples.ts` whose body is the code shown on screen; `ErrorsScreen` passes `errorsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ErrorsScreen.tsx`](../../../../../src/features/typescript/errors/ErrorsScreen.tsx) | Introduction |
| [`ErrorsSamples.ts`](../../../../../src/features/typescript/errors/ErrorsSamples.ts) | Samples in display order (try, catch, and finally, Custom error classes, unknown in catch, Result values, finally for cleanup) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptErrors` |

## Ownership and state

- `errorsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptErrors`; pushes nothing.

## Engine-specific messages

`JSON.parse` error messages differ between browsers, so the unknown-in-catch sample logs only the error's name (`SyntaxError`), keeping the output the same everywhere.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Error handling: finally runs before the caller continues"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: ERR-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
