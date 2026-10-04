# Objects, classes & enums detailed design

Status: Implemented

Requirements: [Objects, classes & enums](classes_requirement.md)

## Implementation goal

Each sample is a top-level function in `ClassesSamples.ts` whose body is the code shown on screen; `ClassesScreen` passes `classesSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ClassesScreen.tsx`](../../../../../src/features/typescript/classes/ClassesScreen.tsx) | Introduction |
| [`ClassesSamples.ts`](../../../../../src/features/typescript/classes/ClassesSamples.ts) | Samples in display order (Object types, Classes, Values and references, Enums with as const, Discriminated unions) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptClasses` |

## Ownership and state

- `classesSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptClasses`; pushes nothing.

## Why not enum

The project sets `erasableSyntaxOnly`, which allows only TypeScript syntax that compiles away to plain JavaScript. `enum` and constructor parameter properties generate code, so they are rejected; the sample shows the `as const` object pattern instead, with a comment explaining the rule.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Objects, classes & enums: spread copies, assignment shares"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: CLS-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
