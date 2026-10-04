# Feature: Error handling

Status: Implemented

## Goal

Show how JavaScript throws and catches errors, how TypeScript types a caught value, and how to make failures explicit.

## Scope

### In scope

- `try`, `catch`, and `finally`.
- Custom error classes and `instanceof`.
- `unknown` in `catch`.
- Result values instead of exceptions.
- `finally` for cleanup.

### Out of scope

- Promise rejections (see Promises & async/await).
- Global error handlers.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Error handling** (`/typescript/typescriptErrors`).
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
| ERR-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| ERR-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| ERR-AC-03 | Run try, catch, and finally | Each `parsed …` line appears before the line that uses the result. |
| ERR-AC-04 | Run finally for cleanup | For an empty name, `failed: empty` is logged before `close ""`. |
| ERR-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/errors/`.
- Route `typescriptErrors` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](errors_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
