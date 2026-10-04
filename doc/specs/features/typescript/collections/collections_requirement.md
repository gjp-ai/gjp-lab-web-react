# Feature: Arrays, sets & maps

Status: Implemented

## Goal

Show JavaScript's collections and the array methods that transform them, and which operations copy versus change in place.

## Scope

### In scope

- Arrays with `toSorted` and spread.
- `Set` membership and combining sets.
- `Map` lookups and iteration.
- `map`, `filter`, and `reduce`.
- Shallow versus per-item copies.

### Out of scope

- Typed arrays and `WeakMap`.
- ES2025 set methods (not in the project's ES2023 library).

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Arrays, sets & maps** (`/typescript/typescriptCollections`).
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
| COL-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| COL-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| COL-AC-03 | Run Arrays | The editable copy gains Swift; the original is unchanged. |
| COL-AC-04 | Run Copies are shallow | Changing the shallow copy changes the original; the per-item copy keeps Ada. |
| COL-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/collections/`.
- Route `typescriptCollections` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](collections_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
