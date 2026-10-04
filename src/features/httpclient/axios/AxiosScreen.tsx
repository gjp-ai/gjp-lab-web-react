import { type HttpClient, HttpClientCard, HttpClientScreen } from '@/features/httpclient/shared/HttpClientScreen'
import { executeAxiosRequest } from './axiosRepository'
// Vite's ?raw import bundles the file's text, so the page shows the code that actually sends the request.
import repositorySource from './axiosRepository.ts?raw'
import { buildAxiosSnippet } from './axiosSnippet'

const axiosClient: HttpClient = {
  intro: 'Build an HTTP request, send it with axios, a popular promise-based HTTP client library, and inspect the response.',
  send: (method, url, payload, signal) => executeAxiosRequest(method, url, payload, { signal }),
  snippet: buildAxiosSnippet,
  snippetCaption: 'The axios call for the request above, updated as you edit it. A JSON body is passed as an object; axios serializes it and sets the headers.',
  invalidJsonHint: 'This is not valid JSON. axios will send it as a JSON string, in quotes.',
  source: {
    fileName: 'axiosRepository.ts',
    code: repositorySource,
    caption:
      'The code this page runs. It configures one axios instance to resolve every status and keep the raw text, so the page can show the same details as the fetch topic.',
  },
}

/** Each row compares one task; the cells are short so the table fits a phone. */
const differences: { task: string; fetch: string; axios: string }[] = [
  { task: 'Where it comes from', fetch: 'Built into the browser', axios: 'A library added to the app (npm install axios)' },
  { task: 'HTTP errors such as 404 or 500', fetch: 'Resolves; check response.ok', axios: 'Rejects by default; validateStatus decides' },
  { task: 'JSON response', fetch: 'Call await response.json()', axios: 'Already parsed into response.data' },
  { task: 'JSON request body', fetch: 'JSON.stringify it and set Content-Type', axios: 'Pass an object; axios does both' },
  { task: 'Timeout', fetch: 'signal: AbortSignal.timeout(ms)', axios: 'The timeout option' },
  { task: 'Cancel', fetch: 'An AbortController signal', axios: 'The same signal option' },
  { task: 'Shared settings', fetch: 'Write your own wrapper', axios: 'axios.create() and interceptors' },
  { task: 'Upload progress', fetch: 'Not available', axios: 'onUploadProgress (uses XMLHttpRequest)' },
]

export function AxiosScreen() {
  return (
    <HttpClientScreen client={axiosClient}>
      <HttpClientCard title="fetch or axios?">
        <p className="text-sm text-on-surface-variant">
          Both send the same requests. fetch needs no dependency; axios saves code for JSON, errors, and shared settings. Compare this
          topic with the fetch topic to see the same request written both ways.
        </p>
        {/* Narrow panes: one block per task. Wider panes (the screen is a container) show a table instead. */}
        <dl className="flex flex-col divide-y divide-outline-variant/50 text-sm @xl:hidden">
          {differences.map((row) => (
            <div key={row.task} className="flex flex-col gap-1 py-2.5">
              <dt className="font-semibold">{row.task}</dt>
              <dd className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 break-words">
                <span className="text-on-surface-variant">fetch</span>
                <span>{row.fetch}</span>
                <span className="text-on-surface-variant">axios</span>
                <span>{row.axios}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="hidden @xl:block">
          <table className="w-full border-collapse text-left text-sm [&_td]:align-top [&_th]:align-top">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Task
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  fetch
                </th>
                <th scope="col" className="py-2 font-semibold">
                  axios
                </th>
              </tr>
            </thead>
            <tbody>
              {differences.map((row) => (
                <tr key={row.task} className="border-b border-outline-variant/50 last:border-0">
                  <th scope="row" className="py-2 pr-4 font-semibold">
                    {row.task}
                  </th>
                  <td className="py-2 pr-4">{row.fetch}</td>
                  <td className="py-2">{row.axios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HttpClientCard>
    </HttpClientScreen>
  )
}
