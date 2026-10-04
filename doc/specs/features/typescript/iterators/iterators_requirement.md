# Feature: Iterators & generators

Status: Implemented

## Goal

Show how iterables feed `for…of`, spread, and destructuring, and how generators produce values on demand.

## Scope

### In scope

- `for…of` over strings, arrays, and maps.
- Generators and `next()`.
- Lazy, infinite sequences.
- Custom iterables with `Symbol.iterator`.
- Destructuring and `Array.from`.

### Out of scope

- Async generators.
- Iterator helper methods (ES2025, not in the project's library).

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Iterators & generators** (`/typescript/typescriptIterators`).
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
| ITR-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| ITR-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| ITR-AC-03 | Run Generators | Output shows `3, 2, 1` and each `next()` result, ending with `{"done":true}`. |
| ITR-AC-04 | Run Lazy, infinite sequences | Output shows the first five squares. |
| ITR-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/iterators/`.
- Route `typescriptIterators` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](iterators_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
