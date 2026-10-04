# Feature: Promises & async/await

Status: Implemented

## Goal

Show how promises represent work that finishes later, how async and await keep that code readable, and how the event loop orders it.

## Scope

### In scope

- `async` and `await`.
- `Promise.all` in parallel.
- `Promise.allSettled`.
- Cancellation with `AbortController`.
- The order of synchronous code, microtasks, and tasks.

### Out of scope

- Web Workers.
- Streams and async iterators.

## Behavior

- Opening the topic shows every sample with its code visible and an empty output area ("Tap Run to see the output").
- **Run** executes that sample's code and shows the lines it logs. Running again replaces the output.
- Output comes from executing the code, never from hard-coded text, and is discarded when the user leaves the topic.

## UI & Navigation

- Entry point: **TypeScript** category → **Promises & async/await** (`/typescript/typescriptPromises`).
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
| PRM-AC-01 | Open the topic | Every sample shows its code, an enabled **Run** button, and an empty output area. |
| PRM-AC-02 | Run a sample twice | Output appears and is replaced, not appended. |
| PRM-AC-03 | Run Promise.all | The total is 140, and three 0.2-second waits overlap. |
| PRM-AC-04 | Run The event loop | Lines appear in the order 1, 2, 3. |
| PRM-AC-05 | Run Cancellation with AbortController | Output shows `stopped: cancelled` and `stopped early: true`. |
| PRM-AC-06 | Unit tests | Every sample runs, gives the same output twice, and matches its snippet; key lines are checked. |

## Technical implementation constraints

- Source lives in `src/features/typescript/promises/`.
- Route `typescriptPromises` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The page and cards come from the shared [runnable code sample](../../../common/codesample/codesample_detail_design.md).

## Related documents

- [Detailed design](promises_detail_design.md)
- [Runnable code sample](../../../common/codesample/codesample_detail_design.md)
