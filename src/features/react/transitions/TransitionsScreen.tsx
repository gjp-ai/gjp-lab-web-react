import { memo, useActionState, useOptimistic, useState, useTransition } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { type Message, packages, saveProjectName, sendMessage } from './projectRepository'

/**
 * `latencyMs` is how long the pretend server takes and `slowItemMs` how long each list row takes to
 * render; tests pass 0 for both.
 */
export function TransitionsScreen({ latencyMs = 1200, slowItemMs = 1 }: { latencyMs?: number; slowItemMs?: number }) {
  return (
    <LabDemoPage intro="A transition marks an update as not urgent, so React can keep the page responsive and show the old screen until the new one is ready. Actions are async functions run in a transition, with hooks for their pending state, result, and optimistic updates.">
      <TransitionDemo slowItemMs={slowItemMs} />
      <ActionStateDemo latencyMs={latencyMs} />
      <OptimisticDemo latencyMs={latencyMs} />
    </LabDemoPage>
  )
}

function TransitionDemo({ slowItemMs }: { slowItemMs: number }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [usesTransition, setUsesTransition] = useState(true)
  const [isPending, startTransition] = useTransition()

  const onChange = (value: string) => {
    // The field updates at once (urgent); the slow list follows when React has time.
    setQuery(value)
    if (usesTransition) startTransition(() => setFilter(value))
    else setFilter(value)
  }

  return (
    <LabDemoSection
      title="useTransition keeps typing responsive"
      caption="Every row of the list below is deliberately slow to render. With the transition, typing stays smooth and React drops renders that are already out of date. Turn it off and each keystroke waits for the whole list."
    >
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={usesTransition} onChange={(event) => setUsesTransition(event.target.checked)} className="size-4" />
        Filter in a transition
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-on-surface-variant">Filter packages</span>
        <input type="search" value={query} onChange={(event) => onChange(event.target.value)} className={labInputClassName} />
      </label>
      <p className="text-sm text-on-surface-variant" aria-live="polite">
        {isPending ? 'Updating the list…' : `Showing results for “${filter}”`}
      </p>
      <div className={isPending ? 'opacity-50' : undefined}>
        <SlowList filter={filter} slowItemMs={slowItemMs} />
      </div>
    </LabDemoSection>
  )
}

/** memo: typing only changes `query`, so the list renders again only when `filter` changes. */
const SlowList = memo(function SlowList({ filter, slowItemMs }: { filter: string; slowItemMs: number }) {
  const shown = packages.filter((name) => name.includes(filter.trim().toLowerCase()))
  return (
    <ul aria-label="Packages" className="grid h-48 grid-cols-2 content-start gap-x-4 overflow-y-auto rounded-lg border border-outline-variant p-2 font-mono text-xs sm:grid-cols-3">
      {shown.map((name) => (
        <SlowItem key={name} name={name} slowItemMs={slowItemMs} />
      ))}
    </ul>
  )
})

function SlowItem({ name, slowItemMs }: { name: string; slowItemMs: number }) {
  blockMainThread(slowItemMs)
  return <li className="py-0.5">{name}</li>
}

/** Simulates an expensive component: busy-waits, deliberately blocking the main thread. Never do this in real code. */
function blockMainThread(milliseconds: number) {
  const until = performance.now() + milliseconds
  while (performance.now() < until) {
    // Busy-wait on purpose.
  }
}

interface RenameState {
  saved: string
  /** What the field shows after the action; keeps the typed text when saving fails. */
  draft: string
  error?: string
}

function ActionStateDemo({ latencyMs }: { latencyMs: number }) {
  const [state, renameAction, isPending] = useActionState(async (previous: RenameState, formData: FormData): Promise<RenameState> => {
    const name = String(formData.get('name') ?? '')
    try {
      const saved = await saveProjectName(name, latencyMs)
      return { saved, draft: saved }
    } catch (failure) {
      return { ...previous, draft: name, error: failure instanceof Error ? failure.message : 'Saving failed.' }
    }
  }, { saved: 'GJP Lab', draft: 'GJP Lab' })

  return (
    <LabDemoSection
      title="useActionState for a form's result"
      caption="useActionState wraps an async action and returns its latest result, the action to pass to <form action>, and isPending. The previous result comes in as the first argument. Try a name with fewer than 3 characters."
    >
      <p>
        Saved name: <strong>{state.saved}</strong>
      </p>
      <form action={renameAction} className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Project name</span>
          {/* key: the field is recreated with the action's draft after each result. */}
          <input key={`${state.saved}|${state.draft}|${state.error ?? ''}`} name="name" defaultValue={state.draft} className={labInputClassName} aria-invalid={state.error !== undefined} />
        </label>
        <LabButton type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Rename'}
        </LabButton>
      </form>
      <p role="status" className="text-sm text-error">
        {state.error}
      </p>
    </LabDemoSection>
  )
}

interface ShownMessage extends Message {
  isSending?: boolean
}

function OptimisticDemo({ latencyMs }: { latencyMs: number }) {
  const [messages, setMessages] = useState<Message[]>([{ id: 'm0', text: 'Welcome to the chat.' }])
  const [error, setError] = useState<string>()
  // Shows the new message straight away; React drops it when the action ends, by which time the real list has it.
  const [shown, addOptimistic] = useOptimistic<ShownMessage[], string>(messages, (list, text) => [
    ...list,
    { id: `sending-${list.length}`, text, isSending: true },
  ])

  const send = async (formData: FormData) => {
    const text = String(formData.get('message') ?? '').trim()
    if (text === '') return
    setError(undefined)
    addOptimistic(text)
    try {
      const sent = await sendMessage(text, latencyMs)
      setMessages((list) => [...list, sent])
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Sending failed.')
    }
  }

  return (
    <LabDemoSection
      title="useOptimistic shows the result before the server answers"
      caption="The message appears at once, marked “Sending…”. If the server accepts it, it stays; if it fails, React removes it again. Include the word “fail” to see the rollback."
    >
      <ul aria-label="Messages" className="flex flex-col gap-1.5">
        {shown.map((message) => (
          <li
            key={message.id}
            className={'w-fit max-w-full rounded-2xl bg-surface-container px-3 py-1.5 text-sm text-on-surface ' + (message.isSending ? 'opacity-60' : '')}
          >
            {message.text}
            {message.isSending && <span className="ml-2 text-xs text-on-surface-variant">Sending…</span>}
          </li>
        ))}
      </ul>
      <form action={send} className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Message</span>
          <input name="message" autoComplete="off" className={labInputClassName} />
        </label>
        <LabButton type="submit">Send</LabButton>
      </form>
      <p role="status" className="text-sm text-error">
        {error}
      </p>
    </LabDemoSection>
  )
}
