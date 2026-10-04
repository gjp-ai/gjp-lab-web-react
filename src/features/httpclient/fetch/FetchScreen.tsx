import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { labInputClassName } from '@/common/theme/labInput'
import { LabTabs } from '@/common/theme/LabTabs'
import { type ExampleApi, exampleApis, type RequestPreset } from './exampleApis'
import { executeRequest } from './fetchRepository'
// Vite's ?raw import bundles the file's text, so the page shows the code that actually sends the request.
import repositorySource from './fetchRepository.ts?raw'
import { buildFetchSnippet } from './fetchSnippet'
import { type HttpMethod, type HttpResponse, httpMethods, supportsPayload } from './HttpResponse'
import { HttpResponseView, ResponseMeta, StatusBadge } from './HttpResponseView'
import { checkPayload } from './jsonPayload'

// The page opens on the first API's first example (JSONPlaceholder: get a post); the payload starts as
// that API's POST example body.
const initialApi = exampleApis[0]
const initialPreset = initialApi.presets[0]
const initialPayload = initialApi.presets.find((preset) => preset.method === 'POST')?.payload ?? ''

export function FetchScreen() {
  const [method, setMethod] = useState<HttpMethod>(initialPreset.method)
  const [url, setUrl] = useState(initialPreset.url)
  const [payload, setPayload] = useState(initialPayload)
  const [response, setResponse] = useState<HttpResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const controller = useRef<AbortController | null>(null)

  // Leaving the screen cancels a request that is still running.
  useEffect(() => () => controller.current?.abort(), [])

  const send = async () => {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setIsLoading(true)
    setErrorMessage(null)
    try {
      setResponse(await executeRequest(method, url, payload, { signal: current.signal }))
    } catch (error) {
      if (!current.signal.aborted) {
        // Clear the old response so it is not mistaken for the result of this request.
        setResponse(null)
        setErrorMessage(error instanceof Error ? error.message : 'The request failed.')
      }
    } finally {
      if (controller.current === current) setIsLoading(false)
    }
  }

  const applyPreset = (preset: RequestPreset) => {
    setMethod(preset.method)
    setUrl(preset.url)
    // GET and DELETE send no payload, so keep whatever the payload field held.
    if (supportsPayload(preset.method)) setPayload(preset.payload)
    setErrorMessage(null)
  }

  return (
    // A container query lets the cards sit side by side whenever the pane, not the window, is wide enough.
    <div className="@container flex flex-col gap-5 px-5 pb-8">
      <p className="pt-1 text-on-surface-variant">
        Build an HTTP request, send it with the browser's native fetch API, and inspect the response.
      </p>

      <div className="grid items-start gap-5 @4xl:grid-cols-2">
        <Card title="Request">
          <form
            aria-label="Request"
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              void send()
            }}
          >
            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Method"
                value={method}
                onChange={(event) => {
                  setMethod(event.target.value as HttpMethod)
                  setErrorMessage(null)
                }}
                className={labInputClassName + ' w-26 font-mono text-sm font-semibold'}
              >
                {httpMethods.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <input
                type="url"
                aria-label="URL"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                placeholder="https://example.com/api"
                className={labInputClassName + ' min-w-0 flex-1 basis-40 font-mono text-sm'}
              />
            </div>

            {supportsPayload(method) ? (
              <PayloadField payload={payload} onChange={setPayload} />
            ) : (
              <p className="rounded-lg border border-dashed border-outline-variant px-3 py-2.5 text-sm text-on-surface-variant">
                {method} requests have no body.
              </p>
            )}

            <LabButton type="submit" disabled={isLoading || url.trim() === ''} className="w-full">
              {isLoading ? 'Sending…' : 'Send'}
            </LabButton>
          </form>

          <Examples onApply={applyPreset} />
        </Card>

        <Card
          title="Response"
          trailing={
            response !== null &&
            !isLoading && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <StatusBadge status={response.status} />
                <ResponseMeta response={response} />
              </div>
            )
          }
          busy={isLoading}
        >
          {/* Announces each result without moving focus away from the form. */}
          <p role="status" className="sr-only">
            {isLoading ? 'Sending the request…' : response !== null ? `Received HTTP ${response.status}.` : ''}
          </p>
          {errorMessage !== null ? (
            <div role="alert" className="flex flex-col gap-1 rounded-xl bg-error-container p-4 text-on-error-container">
              <p className="font-semibold">The request failed</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          ) : response !== null ? (
            <div className={isLoading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
              <HttpResponseView response={response} />
            </div>
          ) : isLoading ? (
            <EmptyState icon={<Spinner />} text="Sending the request…" />
          ) : (
            <EmptyState icon={<SendIcon />} text="Send a request to see its status, body, and headers here." />
          )}
        </Card>
      </div>

      <Card title="Code">
        <LabTabs
          label="Code"
          tabs={[
            {
              id: 'request',
              label: 'This request',
              content: (
                <CodePanel
                  caption="The fetch call for the request above, updated as you edit it. A JSON body is written with JSON.stringify for readability; the page sends the text as typed."
                  code={buildFetchSnippet(method, url, payload)}
                />
              ),
            },
            {
              id: 'implementation',
              label: 'fetchRepository.ts',
              content: (
                <CodePanel
                  caption="The code this page runs. executeRequest adds URL checks, a 15-second timeout, cancellation, timing, and readable errors around the same fetch call."
                  code={repositorySource.trim()}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

/** Free public APIs to try: choose one in the menu, then an example fills the form. */
function Examples({ onApply }: { onApply: (preset: RequestPreset) => void }) {
  const [api, setApi] = useState<ExampleApi>(initialApi)
  const selectId = useId()
  return (
    <div className="flex flex-col gap-2.5 border-t border-outline-variant/60 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={selectId} className="text-sm font-semibold">
          Examples from
        </label>
        <select
          id={selectId}
          value={api.id}
          onChange={(event) => setApi(exampleApis.find((option) => option.id === event.target.value) ?? initialApi)}
          className={labInputClassName + ' min-w-0 flex-1 basis-48 text-sm'}
        >
          {exampleApis.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-on-surface-variant">
        {api.description}{' '}
        <a href={api.docsUrl} target="_blank" rel="noreferrer" className="font-semibold whitespace-nowrap text-on-surface underline">
          {api.name} docs
        </a>
      </p>
      <ul aria-label={`${api.name} examples`} className="flex flex-wrap gap-2">
        {api.presets.map((preset) => (
          <li key={preset.label}>
            <button
              type="button"
              onClick={() => onApply(preset)}
              className="flex min-h-10 items-center gap-2 rounded-full border border-outline-variant bg-surface px-3.5 text-sm text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[11px] font-semibold">{preset.method}</span>{' '}
              {preset.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PayloadField({ payload, onChange }: { payload: string; onChange: (payload: string) => void }) {
  const id = useId()
  const check = checkPayload(payload)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm text-on-surface-variant">
          Body (JSON)
        </label>
        <button
          type="button"
          onClick={() => check.kind === 'json' && onChange(check.formatted)}
          disabled={check.kind !== 'json'}
          className="rounded-full px-3 py-1 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary disabled:text-on-surface-variant disabled:hover:bg-transparent"
        >
          Format
        </button>
      </div>
      <textarea
        id={id}
        value={payload}
        onChange={(event) => onChange(event.target.value)}
        rows={7}
        spellCheck={false}
        aria-describedby={check.kind === 'text' ? `${id}-hint` : undefined}
        className={labInputClassName + ' font-mono text-sm'}
      />
      {check.kind === 'text' && (
        <p id={`${id}-hint`} className="text-sm text-error">
          This is not valid JSON. It will be sent as plain text.
        </p>
      )}
    </div>
  )
}

function Card({ title, trailing, busy, children }: { title: string; trailing?: ReactNode; busy?: boolean; children: ReactNode }) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      aria-busy={busy}
      className="flex min-w-0 flex-col gap-4 rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]"
    >
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <h2 id={headingId} className="text-lg font-semibold">
          {title}
        </h2>
        {trailing}
      </div>
      {children}
    </section>
  )
}

function CodePanel({ caption, code }: { caption: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-on-surface-variant">{caption}</p>
      <pre className="max-h-[28rem] overflow-auto rounded-lg bg-surface-container p-3 font-mono text-xs text-on-surface">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant px-4 py-10 text-center text-sm text-on-surface-variant">
      {icon}
      <p>{text}</p>
    </div>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  )
}

function Spinner() {
  return <span className="size-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary motion-reduce:animate-none" aria-hidden="true" />
}
