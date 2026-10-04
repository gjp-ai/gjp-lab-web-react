import { useId, useState, type FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { type FeedbackReceipt, sendFeedback } from './feedbackRepository'
import { type SignUpValues, validateSignUp } from './signUpValidation'

/** `latencyMs` is how long the pretend server takes; tests pass 0. */
export function FormsScreen({ latencyMs = 1200 }: { latencyMs?: number }) {
  return (
    <LabDemoPage intro="A controlled input shows a value from state and reports every change, so React always knows what is in the form. An uncontrolled form keeps values in the DOM and reads them when it is submitted, which React 19 form actions make simple.">
      <ControlledDemo />
      <ValidationDemo />
      <ActionDemo latencyMs={latencyMs} />
    </LabDemoPage>
  )
}

type Plan = 'free' | 'team' | 'enterprise'
type Size = 'S' | 'M' | 'L'

function ControlledDemo() {
  const [name, setName] = useState('')
  const [plan, setPlan] = useState<Plan>('team')
  const [size, setSize] = useState<Size>('M')
  const [wantsNews, setWantsNews] = useState(true)

  return (
    <LabDemoSection
      title="Controlled inputs"
      caption="Each control reads its value from state (value or checked) and writes it back in onChange. The summary below is rendered from the same state."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className={labInputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Plan</span>
          <select value={plan} onChange={(event) => setPlan(event.target.value as Plan)} className={labInputClassName}>
            <option value="free">Free</option>
            <option value="team">Team</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </label>
      </div>
      <fieldset className="flex flex-wrap items-center gap-4 text-sm">
        <legend className="mb-1 text-on-surface-variant">T-shirt size</legend>
        {(['S', 'M', 'L'] as const).map((option) => (
          <label key={option} className="flex items-center gap-1.5">
            <input type="radio" name="size" value={option} checked={size === option} onChange={() => setSize(option)} className="size-4" />
            {option}
          </label>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={wantsNews} onChange={(event) => setWantsNews(event.target.checked)} className="size-4" />
        Email me product news
      </label>
      <dl aria-label="Form state" className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-surface-container p-3 text-sm text-on-surface">
        <dt className="text-on-surface-variant">name</dt>
        <dd>{name === '' ? '""' : name}</dd>
        <dt className="text-on-surface-variant">plan</dt>
        <dd>{plan}</dd>
        <dt className="text-on-surface-variant">size</dt>
        <dd>{size}</dd>
        <dt className="text-on-surface-variant">news</dt>
        <dd>{String(wantsNews)}</dd>
      </dl>
    </LabDemoSection>
  )
}

function ValidationDemo() {
  const [values, setValues] = useState<SignUpValues>({ email: '', password: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof SignUpValues, boolean>>>({})
  const [createdFor, setCreatedFor] = useState<string>()
  const errors = validateSignUp(values)

  const update = (field: keyof SignUpValues, value: string) => {
    setValues({ ...values, [field]: value })
    setCreatedFor(undefined)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
    const firstInvalid = (Object.keys(errors) as (keyof SignUpValues)[])[0]
    if (firstInvalid !== undefined) {
      // Move focus to the first problem, so keyboard and screen-reader users land on it.
      const field = event.currentTarget.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }
    setCreatedFor(values.email.trim())
    setValues({ email: '', password: '' })
    setTouched({})
  }

  return (
    <LabDemoSection
      title="Validation messages"
      caption="Errors are calculated from state on every render, shown after a field loses focus or the form is submitted, and linked to the field with aria-describedby and aria-invalid."
    >
      {/* noValidate: the form shows its own messages instead of the browser's bubbles. */}
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
        <ValidatedField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={(value) => update('email', value)}
          onBlur={() => setTouched((state) => ({ ...state, email: true }))}
        />
        <ValidatedField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, including a number."
          value={values.password}
          error={touched.password ? errors.password : undefined}
          onChange={(value) => update('password', value)}
          onBlur={() => setTouched((state) => ({ ...state, password: true }))}
        />
        <div>
          <LabButton type="submit">Create account</LabButton>
        </div>
        <p role="status" className="text-sm text-success">
          {createdFor !== undefined && `Account created for ${createdFor}.`}
        </p>
      </form>
    </LabDemoSection>
  )
}

function ValidatedField({
  label,
  name,
  type,
  autoComplete,
  hint,
  value,
  error,
  onChange,
  onBlur,
}: {
  label: string
  name: keyof SignUpValues
  type: string
  autoComplete: string
  hint?: string
  value: string
  error?: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  // useId gives ids that are unique on the page, to link the label, hint, and error to the input.
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint !== undefined ? hintId : undefined, error !== undefined ? errorId : undefined].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="text-on-surface-variant">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={error !== undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={labInputClassName}
      />
      {hint !== undefined && (
        <p id={hintId} className="text-on-surface-variant">
          {hint}
        </p>
      )}
      {error !== undefined && (
        <p id={errorId} className="text-error">
          {error}
        </p>
      )}
    </div>
  )
}

function ActionDemo({ latencyMs }: { latencyMs: number }) {
  const [receipt, setReceipt] = useState<FeedbackReceipt>()
  const [error, setError] = useState<string>()

  // A form action receives the submitted FormData. React resets the uncontrolled fields when it finishes.
  const submit = async (formData: FormData) => {
    setError(undefined)
    try {
      setReceipt(await sendFeedback(String(formData.get('topic')), String(formData.get('message') ?? ''), latencyMs))
    } catch (failure) {
      setReceipt(undefined)
      setError(failure instanceof Error ? failure.message : 'Sending failed.')
    }
  }

  return (
    <LabDemoSection
      title="Form actions"
      caption="<form action={submit}> calls an async function with the FormData; no onChange or state per field. useFormStatus lets the submit button show that the form is sending. The server is simulated."
    >
      <form action={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Topic</span>
          <select name="topic" defaultValue="Idea" className={labInputClassName}>
            <option>Idea</option>
            <option>Bug</option>
            <option>Question</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Message</span>
          <textarea name="message" rows={3} className={labInputClassName} />
        </label>
        <div>
          <SendButton />
        </div>
      </form>
      <p role="status" className="text-sm">
        {receipt !== undefined && (
          <span className="text-success">
            {receipt.topic} received as ticket {receipt.ticket}.
          </span>
        )}
        {error !== undefined && <span className="text-error">{error}</span>}
      </p>
    </LabDemoSection>
  )
}

/** useFormStatus reads the nearest parent <form>, so it must be called in a component inside it. */
function SendButton() {
  const { pending } = useFormStatus()
  return (
    <LabButton type="submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send feedback'}
    </LabButton>
  )
}
