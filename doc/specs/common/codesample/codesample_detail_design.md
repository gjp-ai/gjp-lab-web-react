# Runnable code sample detailed design

Status: Implemented

Used by: every topic in the **TypeScript** category ([Values & types](../../features/typescript/basics/basics_requirement.md), [Null & undefined](../../features/typescript/nullish/nullish_requirement.md), [Arrays, sets & maps](../../features/typescript/collections/collections_requirement.md), [Functions & closures](../../features/typescript/functions/functions_requirement.md), [Objects, classes & enums](../../features/typescript/classes/classes_requirement.md), [Interfaces & generics](../../features/typescript/generics/generics_requirement.md), [Error handling](../../features/typescript/errors/errors_requirement.md), [Promises & async/await](../../features/typescript/promises/promises_requirement.md), [Iterators & generators](../../features/typescript/iterators/iterators_requirement.md), [Strings & regex](../../features/typescript/strings/strings_requirement.md)).

## Implementation goal

Show a piece of TypeScript next to the output it really produces. A sample is a value that holds the code text and the function that is that code; a shared card shows it, runs it on request, and shows the output.

## Source map

| Source | Responsibility |
| --- | --- |
| [`CodeSample.ts`](../../../../src/common/codesample/CodeSample.ts) | `CodeSample` (title, explanation, code text, `run`), `SampleLog`, and `runSample` |
| [`CodeSampleCard.tsx`](../../../../src/common/codesample/CodeSampleCard.tsx) | `CodeSamplePage` (a `LabDemoPage` of cards) and `CodeSampleCard` (code, **Run**, output) |
| [`LabDemoSection.tsx`](../../../../src/common/theme/LabDemoSection.tsx) | The page and card layout |

## Ownership and state

- `CodeSample.run` may be ordinary or `async`; `runSample` awaits it with a fresh log and returns the lines.
- `CodeSampleCard` owns `output` (`string[] | null`) and `runCount` with `useState`. **Run** clears the output and increments `runCount`; an effect keyed on `runCount` runs the sample and stores the lines. `isRunning` is derived (`runCount > 0 && output === null`), so **Run** is disabled while a sample runs.
- The effect's cleanup marks the run as stale, so leaving the topic or starting a new run ignores a result that arrives late.

## Layout

- Code: a `pre` on `surface-container` that scrolls sideways instead of wrapping, in a 13 px monospace font.
- **Run**: a `LabButton` labelled "Running…" while running; test id `codeSample.run`.
- Output: an "Output" label, then the lines in a bordered box. The output `pre` is an `aria-live="polite"` region (test id `codeSample.output`), so screen readers read it when a run finishes. Before the first run it says "Tap Run to see the output".

## Keeping code and output in sync

Each topic's `<topic>Samples.ts` stores the snippet as a template literal next to a top-level function whose body is the same code. Inside the template literal, a backtick is written `` \` `` and `${` is written `\${`. The category's test (`typescriptTopics.test.ts`) imports each topic's source with Vite's `?raw` suffix, extracts the body of every `function name(log: SampleLog)` or `async function name(log: SampleLog)` in file order, and checks that each snippet ends with the matching body, so a snippet and its code cannot drift apart without failing `npm test`.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Snippet text is still written twice | Edits are made in two places, although the test catches a mismatch | Generate the snippet from the function at build time |
| No syntax highlighting | Code is harder to scan | Highlight with a small library, or with spans using theme colours |
| Long-running samples cannot be cancelled | A slow async sample finishes even after the user leaves; its result is ignored | Pass an `AbortSignal` to `run` |

## Verification

- Automated: `CodeSampleCard.test.tsx` (code shown, output after Run, replaced on the next run); `typescriptTopics.test.ts` (every sample in every topic runs, gives the same output twice, and matches its function).
- Manual: run each sample in Chrome and Safari, with a screen reader, in light and dark mode.
