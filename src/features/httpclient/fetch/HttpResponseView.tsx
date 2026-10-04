import { LabTabs } from '@/common/theme/LabTabs'
import { formatBytes, type HttpResponse, reasonPhrase } from './HttpResponse'

/** The status badge with the reason phrase ("200 OK"), coloured by class: 2xx success, 4xx and 5xx error. */
export function StatusBadge({ status }: { status: number }) {
  const tone = status >= 200 && status < 300 ? 'text-success' : status >= 400 ? 'text-error' : 'text-on-surface'
  return (
    <span className={'inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-mono text-sm font-semibold ' + tone}>
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      {status} {reasonPhrase(status)}
    </span>
  )
}

/** Time and size of a response, for example "182 ms · 292 B". */
export function ResponseMeta({ response }: { response: HttpResponse }) {
  return (
    <span className="text-sm text-on-surface-variant">
      {response.durationMs} ms · {formatBytes(response.sizeBytes)}
    </span>
  )
}

/** The body and headers of a completed request, as two tabs. */
export function HttpResponseView({ response }: { response: HttpResponse }) {
  return (
    <LabTabs
      label="Response details"
      tabs={[
        {
          id: 'body',
          label: 'Body',
          content: (
            <pre className="max-h-[28rem] overflow-auto rounded-lg bg-surface-container p-3 font-mono text-sm text-on-surface">
              {response.body === '' ? '(empty body)' : response.body}
            </pre>
          ),
        },
        {
          id: 'headers',
          label: (
            <>
              Headers <span className="rounded-full bg-surface-container px-1.5 text-xs text-on-surface-variant">{response.headers.length}</span>
            </>
          ),
          content: (
            <div className="flex flex-col gap-2">
              {response.headers.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No headers are visible to this site.</p>
              ) : (
                <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 rounded-lg bg-surface-container p-3 font-mono text-sm text-on-surface">
                  {response.headers.map(([name, value]) => (
                    <div key={name} className="contents">
                      <dt className="py-1 text-on-surface-variant">{name}</dt>
                      <dd className="py-1 break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="text-xs text-on-surface-variant">
                Browsers only show headers the server exposes to this site (CORS), so this list can be shorter than in a native app.
              </p>
            </div>
          ),
        },
      ]}
    />
  )
}
