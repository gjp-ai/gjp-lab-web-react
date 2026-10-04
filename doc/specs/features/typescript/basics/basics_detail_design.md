# Values & types detailed design

Status: Implemented

Requirements: [Values & types](basics_requirement.md)

## Implementation goal

Each sample is a top-level function in `BasicsSamples.ts` whose body is the code shown on screen; `BasicsScreen` passes `basicsSamples` to the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md) page.

## Source map

| Source | Responsibility |
| --- | --- |
| [`BasicsScreen.tsx`](../../../../../src/features/typescript/basics/BasicsScreen.tsx) | Introduction |
| [`BasicsSamples.ts`](../../../../../src/features/typescript/basics/BasicsSamples.ts) | Samples in display order (let and const, Type inference, Numbers and BigInt, Template literals, Destructuring and union types) |
| [`typescriptTopics.test.ts`](../../../../../src/features/typescript/typescriptTopics.test.ts) | Runs every sample and checks snippets against the source |
| [`CodeSampleCard.tsx`](../../../../../src/common/codesample/CodeSampleCard.tsx) | Shared page, card, and run flow |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads `BasicsScreen` for `typescriptBasics` |

## Ownership and state

- `basicsSamples` is a constant array; the screen owns no state, and each card owns its own output.
- Reached at `/typescript/typescriptBasics`; pushes nothing.

## Compile-time lessons kept as comments

Lines that would not compile (assigning to a `const`, assigning `'cold'` to the `Feeling` union) stay in the snippets as comments, so readers see the rule without breaking the build.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| `typeof` cannot show TypeScript-only types | `Feeling` and tuple types are not visible at run time | Explain with hover types in an editor, or add a type-level sample |
| Snippets are maintained by hand | Edits are made twice, although the test catches a mismatch | See the shared [code sample known gaps](../../../common/codesample/codesample_detail_design.md#known-gaps) |

## Verification

- Automated: `typescriptTopics.test.ts` (every sample, plus "Values & types: inferred types and number limits"); `ContentView.test.tsx` opens the topic from the sidebar.
- Manual: VAL-AC-01 to VAL-AC-05 in Chrome and Safari, in light and dark mode.
