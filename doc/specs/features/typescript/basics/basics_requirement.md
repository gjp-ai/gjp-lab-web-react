# Feature: Values & types

Status: Implemented

## Goal

Show how TypeScript declares values, infers their types, handles number limits, builds strings, and restricts values with union types.

## Scope

### In scope

- `const` versus `let`.
- Type inference and `typeof` at run time.
- `Number.MAX_SAFE_INTEGER`, floating-point rounding, and `BigInt`.
- Template literals with `${…}`.
- Destructuring and string-literal union types.

### Out of scope

- `null` and `undefined` (planned topic: Null & undefined).
- Objects, classes, and enums (planned topic).

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Values & types** (`/typescript/typescriptBasics`).
- An introduction, then one card per sample: explanation, code (monospaced, scrolling sideways), **Run**, and output.
- Screen readers announce the output when a run finishes. Light and dark mode and text zoom are supported.

## Rules & Constraints

- Sample code type-checks under the project's strict TypeScript settings.
- The code shown is the code that runs: each sample is a function stored next to its snippet, and a test checks they match.
- No sample throws, blocks the page, calls the network, or logs user data.

## Platform limitations

- None; samples run in the page.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| VAL-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| VAL-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| VAL-AC-03 | Run Numbers and BigInt | Output shows `max + 1 === max + 2: true`, `0.1 + 0.2 = 0.30000000000000004`, and an exact BigInt. |
| VAL-AC-04 | Run Type inference | Output shows `42: number` and `3.5: number`. |
| VAL-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/basics/`.
- Route `typescriptBasics` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](basics_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
