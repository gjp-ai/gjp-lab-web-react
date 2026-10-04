import { useState, type ReactNode } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'

/** A component is a function from props to UI. */
function Greeting({ name, punctuation = '!' }: { name: string; punctuation?: string }) {
  return (
    <p className="text-lg">
      Hello, <strong>{name}</strong>
      {punctuation}
    </p>
  )
}

/** `children` lets the caller fill a slot, the same way LabDemoSection wraps every demo on this page. */
function Callout({ tone, children }: { tone: 'plain' | 'strong'; children: ReactNode }) {
  const colors = tone === 'strong' ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-surface'
  return <div className={`rounded-xl px-4 py-3 ${colors}`}>{children}</div>
}

function Badge({ count }: { count: number }) {
  // Returning null renders nothing.
  if (count === 0) return null
  return (
    <span className="rounded-full bg-error px-2 py-0.5 text-xs font-semibold text-on-primary" aria-label={`${count} unread`}>
      {count}
    </span>
  )
}

export function ComponentsScreen() {
  const [name, setName] = useState('Ada')
  const [isStrong, setIsStrong] = useState(false)
  const [unread, setUnread] = useState(3)

  return (
    <LabDemoPage intro="React builds a page from components: functions that take props and return what to show. When props or state change, React calls the function again and updates only what differs.">
      <LabDemoSection
        title="Components and props"
        caption="Greeting receives name and an optional punctuation prop with a default. Type in the field: the parent passes new props and Greeting renders again."
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-base text-on-surface"
          />
        </label>
        <Greeting name={name || 'stranger'} />
        <Greeting name={name || 'stranger'} punctuation="?" />
      </LabDemoSection>

      <LabDemoSection
        title="Children and composition"
        caption="Callout styles whatever it wraps. Composition, not inheritance, is how React components share layout."
      >
        <Callout tone={isStrong ? 'strong' : 'plain'}>
          <strong>Tip:</strong> components can wrap any content, including other components.
        </Callout>
        <div>
          <LabButton onClick={() => setIsStrong((value) => !value)}>{isStrong ? 'Use plain tone' : 'Use strong tone'}</LabButton>
        </div>
      </LabDemoSection>

      <LabDemoSection
        title="Conditional rendering"
        caption="Badge returns null when there is nothing to show, and the caller uses && and a ternary to choose what to render."
      >
        <div className="flex items-center gap-3">
          <span>Inbox</span>
          <Badge count={unread} />
        </div>
        <p className="text-sm text-on-surface-variant">{unread > 0 ? `You have ${unread} unread messages.` : 'All caught up.'}</p>
        <div className="flex gap-2">
          <LabButton onClick={() => setUnread((count) => count + 1)}>New message</LabButton>
          {unread > 0 && (
            <button type="button" onClick={() => setUnread(0)} className="min-h-11 rounded-full px-4 font-semibold text-primary hover:bg-surface-container">
              Mark all read
            </button>
          )}
        </div>
      </LabDemoSection>
    </LabDemoPage>
  )
}
