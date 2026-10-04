# Feature: Null & undefined

Status: Implemented

## Goal

Show how TypeScript tracks missing values in the type system and the safe ways to work with them.

## Scope

### In scope

- `null` versus `undefined` in a type.
- Narrowing with a check.
- `??` versus `||`.
- Optional chaining `?.`.
- The non-null assertion `!`, with a safe alternative.

### Out of scope

- `strictNullChecks` off (the project is always strict).
- Optional object properties beyond the samples.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Null & undefined** (`/typescript/typescriptNullish`).
- An introduction, then one card per sample: explanation, code (monospaced, scrolling sideways), **Run**, and output.
- Screen readers announce the output when a run finishes. Light and dark mode and text zoom are supported.

## Rules & Constraints

- Sample code type-checks under the project's strict TypeScript settings, including `erasableSyntaxOnly`.
- The code shown is the code that runs: each sample is a function stored next to its snippet, and a test checks they match.
- No sample throws out of the card, blocks the page, calls the network, or logs user data.

## Platform limitations

- None; samples run in the page.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| NUL-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| NUL-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| NUL-AC-03 | Run ?? versus || | `??` keeps 0 and the empty string; `||` replaces both. |
| NUL-AC-04 | Run Non-null assertion ! | The page does not crash; the output explains what `!` does. |
| NUL-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/nullish/`.
- Route `typescriptNullish` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](nullish_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
