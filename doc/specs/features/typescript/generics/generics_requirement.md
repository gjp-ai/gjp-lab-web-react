# Feature: Interfaces & generics

Status: Implemented

## Goal

Show how interfaces describe shapes, why TypeScript compares shapes rather than names, and how generics keep reusable code type-safe.

## Scope

### In scope

- Interfaces.
- Structural typing.
- Generic functions with a compare function.
- Generic classes with a `#private` field.
- Utility types: `Partial`, `Pick`, and `Readonly`.

### Out of scope

- Conditional and mapped types.
- Declaration merging.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Interfaces & generics** (`/typescript/typescriptGenerics`).
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
| GEN-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| GEN-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| GEN-AC-03 | Run Structural typing | An object that never names the interface is accepted because of its shape. |
| GEN-AC-04 | Run Generic functions | The largest number is 9, the largest word is pear, and an empty list gives undefined. |
| GEN-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/generics/`.
- Route `typescriptGenerics` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](generics_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
