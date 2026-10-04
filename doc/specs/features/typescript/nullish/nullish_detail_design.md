# Null & undefined detailed design

Status: Implemented

Requirements: [Null & undefined](nullish_requirement.md)

## Implementation goal

Each sample is a top-level function in `NullishSamples.ts` whose body is the code shown on screen; `NullishScreen` passes `nullishSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`NullishScreen.tsx`](../../../../../src/features/typescript/nullish/NullishScreen.tsx) | Introduction |
| [`NullishSamples.ts`](../../../../../src/features/typescript/nullish/NullishSamples.ts) | Samples in display order (null and undefined, Narrowing, ?? versus ||, Optional chaining, Non-null assertion !) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptNullish` |

## Ownership and state

- `nullishSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptNullish`; pushes nothing.

## Strict null checks

The project compiles with `strict`, so `string` never includes `null` or `undefined`. Lines that would not compile stay in the snippets as comments.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Null & undefined: ?? keeps 0 and the empty string, || does not"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: NUL-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
