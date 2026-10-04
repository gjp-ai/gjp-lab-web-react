# Interfaces & generics detailed design

Status: Implemented

Requirements: [Interfaces & generics](generics_requirement.md)

## Implementation goal

Each sample is a top-level function in `GenericsSamples.ts` whose body is the code shown on screen; `GenericsScreen` passes `genericsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`GenericsScreen.tsx`](../../../../../src/features/typescript/generics/GenericsScreen.tsx) | Introduction |
| [`GenericsSamples.ts`](../../../../../src/features/typescript/generics/GenericsSamples.ts) | Samples in display order (Interfaces, Structural typing, Generic functions, Generic classes, Utility types) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptGenerics` |

## Ownership and state

- `genericsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptGenerics`; pushes nothing.

## Compile-time lessons

Calls that would not compile (`stack.push(3)`, `frozen.name = 'Lin'`) stay in the snippets as comments.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Interfaces & generics: shapes and type parameters"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: GEN-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
