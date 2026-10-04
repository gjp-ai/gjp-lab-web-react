# Feature: Functions & closures

Status: Implemented

## Goal

Show how functions take arguments and how arrow functions and closures make functions into values.

## Scope

### In scope

- Default and optional parameters.
- Rest parameters and spread.
- Arrow functions.
- Closures that capture variables.
- Functions passed as values.

### Out of scope

- `this` binding rules and `bind`.
- Overloads and decorators.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Functions & closures** (`/typescript/typescriptFunctions`).
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
| FUN-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| FUN-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| FUN-AC-03 | Run Closures capture variables | Output shows `first: 1, 2, 3` and `second: 1, 2`. |
| FUN-AC-04 | Run Default and optional parameters | Three greetings show the default, an override, and an optional punctuation. |
| FUN-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/functions/`.
- Route `typescriptFunctions` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](functions_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
