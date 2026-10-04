import { useEffect, useRef, useState, type Ref } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'

export function RefsScreen() {
  return (
    <LabDemoPage intro="A ref is a box whose current value survives renders but does not cause one when it changes. Refs hold DOM elements, so you can focus, measure, or scroll them, and other values the screen does not show, such as a timer id.">
      <FocusDemo />
      <StopwatchDemo />
      <MeasureDemo />
      <ScrollDemo />
    </LabDemoPage>
  )
}

function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <LabDemoSection
      title="Focus an element"
      caption="useRef creates the box and ref={inputRef} puts the input element in it once it is on the page. In React 19 a component can take ref as an ordinary prop, as SearchField does."
    >
      <SearchField ref={inputRef} />
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={() => inputRef.current?.focus()}>Focus the field</LabButton>
        <LabButton variant="secondary" onClick={() => inputRef.current?.select()}>
          Select its text
        </LabButton>
      </div>
    </LabDemoSection>
  )
}

/** Passes the ref it receives through to its <input>. */
function SearchField({ ref }: { ref: Ref<HTMLInputElement> }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-on-surface-variant">Search the docs</span>
      <input ref={ref} type="search" defaultValue="useRef" className={labInputClassName} />
    </label>
  )
}

function StopwatchDemo() {
  const [startedAt, setStartedAt] = useState<number>()
  const [now, setNow] = useState(0)
  // The interval id is needed to stop the timer, but never shown, so it lives in a ref rather than state.
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const start = () => {
    const time = Date.now()
    setStartedAt(time)
    setNow(time)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setNow(Date.now()), 50)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
  }

  // Stop the timer if the screen closes while it runs.
  useEffect(() => stop, [])

  const elapsed = startedAt === undefined ? 0 : (now - startedAt) / 1000
  return (
    <LabDemoSection
      title="Remember a value without rendering"
      caption="The stopwatch keeps its interval id in intervalRef.current. Changing a ref never renders again; the elapsed time is in state because the screen shows it."
    >
      <p className="text-3xl font-semibold tabular-nums">{elapsed.toFixed(2)} s</p>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={start}>{startedAt === undefined ? 'Start' : 'Restart'}</LabButton>
        <LabButton variant="secondary" onClick={stop}>
          Stop
        </LabButton>
      </div>
    </LabDemoSection>
  )
}

const boxWidths = { narrow: 'w-1/3', half: 'w-1/2', full: 'w-full' } as const

function MeasureDemo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<keyof typeof boxWidths>('half')
  const [size, setSize] = useState<string>()

  const measure = () => {
    const box = boxRef.current?.getBoundingClientRect()
    if (box !== undefined) setSize(`${Math.round(box.width)} × ${Math.round(box.height)} px`)
  }

  return (
    <LabDemoSection
      title="Measure an element"
      caption="Layout is only known after the browser draws the page, so read it from the element in an event handler or an effect, here with getBoundingClientRect()."
    >
      <div className="flex flex-wrap gap-4 text-sm">
        {(Object.keys(boxWidths) as (keyof typeof boxWidths)[]).map((option) => (
          <label key={option} className="flex items-center gap-1.5">
            <input
              type="radio"
              name="box-width"
              checked={width === option}
              onChange={() => {
                setWidth(option)
                setSize(undefined)
              }}
              className="size-4"
            />
            {option}
          </label>
        ))}
      </div>
      <div ref={boxRef} className={`${boxWidths[width]} rounded-xl bg-primary-container px-4 py-6 text-center text-on-surface`}>
        Box
      </div>
      <div className="flex items-center gap-3">
        <LabButton onClick={measure}>Measure</LabButton>
        <p role="status">{size !== undefined && `Measured: ${size}`}</p>
      </div>
    </LabDemoSection>
  )
}

const rowCount = 40

function ScrollDemo() {
  // One ref per row would mean 40 useRef calls; a Map filled by ref callbacks scales to any list.
  const rows = useRef(new Map<number, HTMLLIElement>())
  // The typed text, kept as-is while typing; it becomes a row number only when it is used.
  const [draft, setDraft] = useState('25')
  const target = Math.min(rowCount, Math.max(1, Math.round(Number(draft)) || 1))

  const scrollTo = (row: number) => rows.current.get(row)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  return (
    <LabDemoSection
      title="Refs to many elements"
      caption="Each row registers itself with a ref callback and removes itself in the cleanup the callback returns (new in React 19). The button looks the row up and scrolls the list to it."
    >
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Row (1–{rowCount})</span>
          <input
            type="number"
            min={1}
            max={rowCount}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={labInputClassName + ' w-24'}
          />
        </label>
        <LabButton onClick={() => scrollTo(target)}>Scroll to row</LabButton>
      </div>
      <ol aria-label="Rows" className="h-40 overflow-y-auto rounded-lg border border-outline-variant">
        {Array.from({ length: rowCount }, (_, index) => index + 1).map((row) => (
          <li
            key={row}
            ref={(element) => {
              if (element !== null) rows.current.set(row, element)
              return () => {
                rows.current.delete(row)
              }
            }}
            className={'px-3 py-2 text-sm ' + (row === target ? 'bg-surface-container font-semibold' : '')}
          >
            Row {row}
          </li>
        ))}
      </ol>
    </LabDemoSection>
  )
}
