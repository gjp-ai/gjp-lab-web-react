# Feature: Objects, classes & enums

Status: Implemented

## Goal

Show how TypeScript models data with object types, behaviour with classes, and fixed sets of cases with `as const` objects and discriminated unions.

## Scope

### In scope

- Object types, spread copies, and destructuring.
- Classes with a `#private` field and a getter.
- Shared references versus spread copies.
- Enum-like `as const` objects.
- Discriminated unions with an exhaustive `switch`.

### Out of scope

- The `enum` keyword and constructor parameter properties (not allowed by `erasableSyntaxOnly`).
- Inheritance hierarchies.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Objects, classes & enums** (`/typescript/typescriptClasses`).
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
| CLS-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| CLS-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| CLS-AC-03 | Run Values and references | The spread copy changes alone; the alias changes the original; `same object: true`. |
| CLS-AC-04 | Run Discriminated unions | Each payment kind is described. |
| CLS-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/classes/`.
- Route `typescriptClasses` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](classes_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
