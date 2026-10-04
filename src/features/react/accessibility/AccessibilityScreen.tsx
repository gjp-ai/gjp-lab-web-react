import { useId, useState } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
// Vite's ?raw import bundles the file's text, so the page shows the real test that runs in CI.
import screenTest from './AccessibilityScreen.test.tsx?raw'

export function AccessibilityScreen() {
  return (
    <LabDemoPage intro="Accessible React starts with the right HTML elements, adds ARIA only to describe state that HTML cannot, and is tested the way people use the page: by role and visible name, with the keyboard.">
      <SemanticDemo />
      <DisclosureDemo />
      <LiveRegionDemo />
      <TestingDemo />
    </LabDemoPage>
  )
}

function SemanticDemo() {
  const [buttonClicks, setButtonClicks] = useState(0)
  const [divClicks, setDivClicks] = useState(0)
  return (
    <LabDemoSection
      title="Semantic HTML first"
      caption="Press Tab to move through the page. The <button> can be reached and pressed with Enter or Space, and is announced as a button. The <div> with onClick only works with a mouse, and screen readers see plain text."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col items-start gap-2 rounded-xl border border-outline-variant p-3">
          <span className="font-mono text-xs text-on-surface-variant">{'<button>'}</span>
          <LabButton onClick={() => setButtonClicks((count) => count + 1)}>Save</LabButton>
          <span className="text-sm">Pressed {buttonClicks} times</span>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-error p-3">
          <span className="font-mono text-xs text-on-surface-variant">{'<div onClick> (avoid)'}</span>
          {/* Deliberately inaccessible, to compare with the button. */}
          <div onClick={() => setDivClicks((count) => count + 1)} className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-5 font-semibold text-on-primary">
            Save
          </div>
          <span className="text-sm">Pressed {divClicks} times</span>
        </div>
      </div>
    </LabDemoSection>
  )
}

const questions = [
  { question: 'Why use a button for the toggle?', answer: 'A button is focusable, works with Enter and Space, and is announced as a button, all without extra code.' },
  { question: 'What does aria-expanded add?', answer: 'It tells assistive technology whether the panel the button controls is open, which the visual arrow alone cannot.' },
]

function DisclosureDemo() {
  return (
    <LabDemoSection
      title="State that HTML cannot express"
      caption="Each question is a real <button> with aria-expanded and aria-controls pointing at its answer. ARIA adds the open or closed state; the button element supplies everything else."
    >
      <div className="flex flex-col divide-y divide-outline-variant/50">
        {questions.map((item) => (
          <Disclosure key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </LabDemoSection>
  )
}

function Disclosure({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  return (
    <div className="py-1">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left font-semibold hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary"
        >
          {question}
          <svg viewBox="0 0 24 24" className={'size-4 shrink-0 transition-transform motion-reduce:transition-none ' + (isOpen ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>
      <p id={panelId} hidden={!isOpen} className="px-2 pb-2 text-sm text-on-surface-variant">
        {answer}
      </p>
    </div>
  )
}

function LiveRegionDemo() {
  const [items, setItems] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const add = () => {
    setItems((count) => count + 1)
    setAnnouncement(`Added to basket. ${items + 1} ${items + 1 === 1 ? 'item' : 'items'} in total.`)
  }
  return (
    <LabDemoSection
      title="Announce changes with a live region"
      caption="When something changes away from the focused control, a screen reader does not notice. An element with role=&quot;status&quot; is a polite live region: its new text is read out without moving focus."
    >
      <div className="flex flex-wrap items-center gap-3">
        <LabButton onClick={add}>Add to basket</LabButton>
        <span className="text-sm">Basket: {items}</span>
      </div>
      {/* The region exists before it changes; screen readers only watch regions that are already on the page. */}
      <p role="status" className="min-h-5 text-sm text-on-surface-variant">
        {announcement}
      </p>
    </LabDemoSection>
  )
}

function TestingDemo() {
  return (
    <LabDemoSection
      title="Test the way people use it"
      caption="Testing Library queries by role and accessible name (getByRole('button', { name: 'Save' })), so a test fails when a control loses its label or its role. This is the test that checks this page."
    >
      <pre className="max-h-80 overflow-auto rounded-lg bg-surface-container p-3 text-xs text-on-surface">
        <code>{screenTest}</code>
      </pre>
    </LabDemoSection>
  )
}
