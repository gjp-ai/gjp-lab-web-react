import { useState, type MouseEvent } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemperature } from './temperature'

export function StateScreen() {
  return (
    <LabDemoPage intro="State is a component's memory. Calling a setter does not change the value in place: it asks React to render the component again with the new value. Event handlers are where most state changes start.">
      <CounterDemo />
      <ObjectStateDemo />
      <PropagationDemo />
      <TemperatureDemo />
    </LabDemoPage>
  )
}

function CounterDemo() {
  const [count, setCount] = useState(0)

  // Each call reads the same `count` from this render, so three calls still add only one.
  const addThreeWithValue = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  // An updater function receives the latest pending value, so the three calls add three.
  const addThreeWithUpdater = () => {
    setCount((value) => value + 1)
    setCount((value) => value + 1)
    setCount((value) => value + 1)
  }

  return (
    <LabDemoSection
      title="useState and updater functions"
      caption="setCount(count + 1) uses the value from the current render. To build on the previous value, pass a function: setCount((value) => value + 1)."
    >
      <p className="text-3xl font-semibold tabular-nums" aria-live="polite">
        Count: {count}
      </p>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={addThreeWithValue}>+3 with value</LabButton>
        <LabButton onClick={addThreeWithUpdater}>+3 with updater</LabButton>
        <LabButton variant="secondary" onClick={() => setCount(0)}>
          Reset
        </LabButton>
      </div>
    </LabDemoSection>
  )
}

interface Person {
  first: string
  last: string
}

function ObjectStateDemo() {
  const [person, setPerson] = useState<Person>({ first: 'Grace', last: 'Hopper' })

  return (
    <LabDemoSection
      title="Objects are replaced, not changed"
      caption="React compares the old and new object. Copy it with spread syntax and change one field; mutating person.first would not render again."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">First name</span>
          <input
            value={person.first}
            onChange={(event) => setPerson({ ...person, first: event.target.value })}
            className={labInputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Last name</span>
          <input
            value={person.last}
            onChange={(event) => setPerson({ ...person, last: event.target.value })}
            className={labInputClassName}
          />
        </label>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-surface-container p-3 text-sm text-on-surface" aria-label="Current state">
        {JSON.stringify(person)}
      </pre>
    </LabDemoSection>
  )
}

function PropagationDemo() {
  const [stopsPropagation, setStopsPropagation] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const record = (entry: string) => setEvents((list) => [...list, entry])

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    record('button handled the click')
    if (stopsPropagation) event.stopPropagation()
  }

  return (
    <LabDemoSection
      title="Events bubble up"
      caption="A click on the button runs its handler, then bubbles to the card's onClick. event.stopPropagation() stops it at the button."
    >
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={stopsPropagation} onChange={(event) => setStopsPropagation(event.target.checked)} className="size-4" />
        Stop propagation in the button
      </label>
      {/* The card only listens for clicks that bubble up from the button; it is not a control itself. */}
      <div
        onClick={() => record('card handled the click')}
        className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-outline-variant p-4"
      >
        <span className="text-sm text-on-surface-variant">Card with onClick</span>
        <LabButton onClick={onButtonClick}>Click me</LabButton>
      </div>
      <div className="flex items-start justify-between gap-3">
        <ol aria-label="Event log" className="flex list-decimal flex-col gap-0.5 pl-5 text-sm">
          {events.length === 0 ? <li className="list-none text-on-surface-variant">No clicks yet</li> : events.map((entry, index) => <li key={index}>{entry}</li>)}
        </ol>
        {events.length > 0 && (
          <LabButton variant="secondary" onClick={() => setEvents([])}>
            Clear
          </LabButton>
        )}
      </div>
    </LabDemoSection>
  )
}

/** The parent owns the one source of truth; both inputs are derived from it. */
function TemperatureDemo() {
  const [celsius, setCelsius] = useState(20)

  return (
    <LabDemoSection
      title="Lifting state up"
      caption="Two inputs that must agree share their state through the parent. The parent keeps one value in Celsius and passes each input its value and an onChange callback."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
        <TemperatureInput
          label="Fahrenheit"
          value={celsiusToFahrenheit(celsius)}
          onChange={(fahrenheit) => setCelsius(fahrenheitToCelsius(fahrenheit))}
        />
      </div>
      <p className="text-sm">{celsius >= 100 ? 'Water boils at this temperature.' : celsius <= 0 ? 'Water freezes at this temperature.' : 'Water is liquid at this temperature.'}</p>
    </LabDemoSection>
  )
}

function TemperatureInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  // The field keeps its own text while typing ("-", "3."), and reports a number only when it parses.
  const [draft, setDraft] = useState<string>()
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <input
        inputMode="decimal"
        value={draft ?? formatTemperature(value)}
        onChange={(event) => {
          setDraft(event.target.value)
          const parsed = Number(event.target.value)
          if (event.target.value.trim() !== '' && Number.isFinite(parsed)) onChange(parsed)
        }}
        onBlur={() => setDraft(undefined)}
        className={labInputClassName}
      />
    </label>
  )
}
