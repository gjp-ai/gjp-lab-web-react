import { useEffect, useState } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { type CodeSample, runSample } from './CodeSample'

/** A scrolling page of runnable samples for one TypeScript topic. */
export function CodeSamplePage({ intro, samples }: { intro: string; samples: CodeSample[] }) {
  return (
    <LabDemoPage intro={`${intro} Samples call log(…) where a script would call console.log(…).`}>
      {samples.map((sample) => (
        <CodeSampleCard key={sample.title} sample={sample} />
      ))}
    </LabDemoPage>
  )
}

/** One sample: explanation, code, a Run button, and the output of the last run. */
export function CodeSampleCard({ sample }: { sample: CodeSample }) {
  const [output, setOutput] = useState<string[] | null>(null)
  const [runCount, setRunCount] = useState(0)
  const isRunning = runCount > 0 && output === null

  // Each Run starts a new effect; leaving the topic (or running again) ignores a run that has not finished.
  useEffect(() => {
    if (runCount === 0) return
    let isCurrent = true
    void runSample(sample).then((lines) => {
      if (isCurrent) setOutput(lines)
    })
    return () => {
      isCurrent = false
    }
  }, [runCount, sample])

  return (
    <LabDemoSection title={sample.title} caption={sample.explanation}>
      {/* Code keeps its line breaks and scrolls sideways instead of wrapping. */}
      <pre className="overflow-x-auto rounded-xl bg-surface-container p-3 font-mono text-[13px] leading-relaxed">
        <code>{sample.code}</code>
      </pre>

      <div>
        <LabButton
          onClick={() => {
            setOutput(null)
            setRunCount((count) => count + 1)
          }}
          disabled={isRunning}
          data-testid="codeSample.run"
        >
          {isRunning ? 'Running…' : 'Run'}
        </LabButton>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border-[0.5px] border-outline-variant p-3">
        <span className="text-xs font-semibold text-on-surface-variant">Output</span>
        {output !== null ? (
          // A polite live region, so screen readers read the output when a run finishes.
          <pre aria-live="polite" className="font-mono text-[13px] whitespace-pre-wrap" data-testid="codeSample.output">
            {output.join('\n')}
          </pre>
        ) : (
          <span className="text-[13px] text-on-surface-variant">Tap Run to see the output</span>
        )}
      </div>
    </LabDemoSection>
  )
}
