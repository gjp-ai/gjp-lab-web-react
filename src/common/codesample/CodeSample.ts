/**
 * Collects the lines a sample prints. Samples write `log('…')` where a script would write
 * `console.log('…')`, so the output can be shown on the page and checked by tests.
 */
export type SampleLog = (line: string) => void

/**
 * One runnable TypeScript sample: the code shown on screen and the function that runs it. `run` is that
 * code, so the output is real, not hard-coded text. Keep `code` identical to the body of `run`.
 */
export interface CodeSample {
  title: string
  explanation: string
  code: string
  run: (log: SampleLog) => void | Promise<void>
}

/** Runs the sample with a fresh log and returns the lines it logged. */
export async function runSample(sample: CodeSample): Promise<string[]> {
  const lines: string[] = []
  await sample.run((line) => lines.push(line))
  return lines
}
