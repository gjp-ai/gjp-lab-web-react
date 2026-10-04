import type { HttpResponse } from './HttpResponse'

export function HttpResponseScreen({ response }: { response: HttpResponse }) {
  const statusColor =
    response.status >= 200 && response.status < 300 ? 'text-success' : response.status >= 400 ? 'text-error' : 'text-on-surface'
  return (
    <div className="flex flex-col gap-3.5 px-5 pb-8">
      <p className="pt-1 text-on-surface-variant">fetch response details</p>
      <ResponseBlock title="HTTP status">
        <p className={statusColor}>{response.status}</p>
      </ResponseBlock>
      <ResponseBlock title="Response JSON">
        <pre className="overflow-x-auto font-mono text-sm">{response.body === '' ? '(empty response)' : response.body}</pre>
      </ResponseBlock>
      {response.headers.length > 0 && (
        <ResponseBlock title="Headers">
          <pre className="overflow-x-auto font-mono text-sm">{response.headers.map(([name, value]) => `${name}: ${value}`).join('\n')}</pre>
          <p className="text-sm text-on-surface-variant">
            Browsers only show headers the server exposes to this site (CORS), so this list can be shorter than in a native app.
          </p>
        </ResponseBlock>
      )}
    </div>
  )
}

function ResponseBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  )
}
