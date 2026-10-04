import { useCallback, useEffect, useState } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { searchFruits } from './fruitSearch'

/** `searchDelayMs` lets tests skip the wait before a search runs. */
export function EffectsScreen({ searchDelayMs = 400 }: { searchDelayMs?: number }) {
  return (
    <LabDemoPage intro="An effect synchronises a component with something outside React, such as a timer, a subscription, or a network request. React runs it after the screen updates, and runs its cleanup before the next run and when the component goes away.">
      <TimerDemo />
      <SearchDemo delayMs={searchDelayMs} />
      <DerivedValueDemo />
    </LabDemoPage>
  )
}

function TimerDemo() {
  const [isShown, setIsShown] = useState(false)
  const [log, setLog] = useState<string[]>([])
  // Stable across renders, so the ticker's effect does not run again just because the parent rendered.
  const record = useCallback((entry: string) => setLog((list) => [...list.slice(-5), entry]), [])

  return (
    <LabDemoSection
      title="Setup and cleanup"
      caption="The ticker starts an interval when it appears and clears it in the cleanup function when it goes. In development, Strict Mode runs setup and cleanup one extra time to check that cleanup works."
    >
      <div>
        <LabButton onClick={() => setIsShown((value) => !value)}>{isShown ? 'Remove ticker' : 'Show ticker'}</LabButton>
      </div>
      {isShown && <Ticker onLog={record} />}
      <EffectLog entries={log} />
    </LabDemoSection>
  )
}

function Ticker({ onLog }: { onLog: (entry: string) => void }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    onLog('setup: interval started')
    const id = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => {
      clearInterval(id)
      onLog('cleanup: interval cleared')
    }
  }, [onLog])

  return (
    <p className="rounded-xl bg-surface-container px-4 py-3 tabular-nums text-on-surface">
      Ticker has run for {seconds} s
    </p>
  )
}

function SearchDemo({ delayMs }: { delayMs: number }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>(() => searchFruits(''))
  const [log, setLog] = useState<string[]>([])

  // Runs whenever `query` changes. Cleanup cancels the pending search, so only the last keystroke searches.
  useEffect(() => {
    const id = setTimeout(() => {
      setResults(searchFruits(query))
      setLog((list) => [...list.slice(-5), `searched for "${query}"`])
    }, delayMs)
    return () => clearTimeout(id)
  }, [query, delayMs])

  return (
    <LabDemoSection
      title="Dependencies decide when it runs"
      caption="The search effect lists query as a dependency, so it runs again when the query changes. Its cleanup clears the previous timer, which turns fast typing into one search."
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-on-surface-variant">Search fruit</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={labInputClassName} />
      </label>
      <p className="text-sm" aria-live="polite">
        {results.length === 0 ? 'No fruit found.' : `${results.length} found: ${results.join(', ')}`}
      </p>
      <EffectLog entries={log} />
    </LabDemoSection>
  )
}

function DerivedValueDemo() {
  const [first, setFirst] = useState('Katherine')
  const [last, setLast] = useState('Johnson')
  // Calculated while rendering: an effect that copied this into state would render twice and could fall out of date.
  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()

  return (
    <LabDemoSection
      title="You might not need an effect"
      caption="Values that come from props or state are calculated during rendering. Keep effects for synchronising with systems outside React."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">First name</span>
          <input value={first} onChange={(event) => setFirst(event.target.value)} className={labInputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Last name</span>
          <input value={last} onChange={(event) => setLast(event.target.value)} className={labInputClassName} />
        </label>
      </div>
      <p>
        Initials: <strong>{initials || '—'}</strong>
      </p>
    </LabDemoSection>
  )
}

function EffectLog({ entries }: { entries: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold">Effect log</h3>
      <ol className="flex flex-col gap-0.5 rounded-lg bg-surface-container p-3 font-mono text-xs text-on-surface">
        {entries.length === 0 ? <li className="text-on-surface-variant">Nothing yet</li> : entries.map((entry, index) => <li key={index}>{entry}</li>)}
      </ol>
    </div>
  )
}
