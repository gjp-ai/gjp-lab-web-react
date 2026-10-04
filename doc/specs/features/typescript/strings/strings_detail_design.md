# Strings & regex detailed design

Status: Implemented

Requirements: [Strings & regex](strings_requirement.md)

## Implementation goal

Each sample is a top-level function in `StringsSamples.ts` whose body is the code shown on screen; `StringsScreen` passes `stringsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`StringsScreen.tsx`](../../../../../src/features/typescript/strings/StringsScreen.tsx) | Introduction |
| [`StringsSamples.ts`](../../../../../src/features/typescript/strings/StringsSamples.ts) | Samples in display order (Characters and Unicode, Tagged templates and String.raw, Regex and named groups, Building and padding strings, Comparing strings) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `typescriptStrings` |

## Ownership and state

- `stringsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptStrings`; pushes nothing.

## Literal types

The comparison sample annotates both strings as `string`; without it, TypeScript would reject comparing two different string literals as always false.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Strings & regex: UTF-16 units, not characters"); `NavigationMenu.test.ts` checks the route is listed once.
- Manual: STR-AC-01 to the last acceptance criterion in Chrome and Safari, in light and dark mode.
