# Feature: Strings & regex

Status: Implemented

## Goal

Show how JavaScript strings store Unicode text, and the tools for building, matching, and comparing it.

## Scope

### In scope

- UTF-16 length versus code points versus UTF-8 bytes.
- Tagged templates and `String.raw`.
- Regular expressions with named groups.
- Building and padding strings.
- Comparing strings with normalization and `localeCompare`.

### Out of scope

- `Intl.Segmenter` for grapheme clusters.
- Localization and plurals.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Strings & regex** (`/typescript/typescriptStrings`).
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
| STR-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| STR-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| STR-AC-03 | Run Characters and Unicode | The thumbs-up with a skin tone has length 4, 2 code points, and 8 UTF-8 bytes. |
| STR-AC-04 | Run Comparing strings | `===` is false for the two spellings of café, and true after normalizing. |
| STR-AC-05 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/strings/`.
- Route `typescriptStrings` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](strings_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
