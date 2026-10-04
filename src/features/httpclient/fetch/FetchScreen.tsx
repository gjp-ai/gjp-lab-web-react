import { type HttpClient, HttpClientScreen } from '@/features/httpclient/shared/HttpClientScreen'
import { executeRequest } from './fetchRepository'
// Vite's ?raw import bundles the file's text, so the page shows the code that actually sends the request.
import repositorySource from './fetchRepository.ts?raw'
import { buildFetchSnippet } from './fetchSnippet'

const fetchClient: HttpClient = {
  intro: "Build an HTTP request, send it with the browser's native fetch API, and inspect the response.",
  send: (method, url, payload, signal) => executeRequest(method, url, payload, { signal }),
  snippet: buildFetchSnippet,
  snippetCaption:
    'The fetch call for the request above, updated as you edit it. A JSON body is written with JSON.stringify for readability; the page sends the text as typed.',
  invalidJsonHint: 'This is not valid JSON. fetch will send it as plain text.',
  source: {
    fileName: 'fetchRepository.ts',
    code: repositorySource,
    caption:
      'The code this page runs. executeRequest adds URL checks, a 15-second timeout, cancellation, timing, and readable errors around the same fetch call.',
  },
}

export function FetchScreen() {
  return <HttpClientScreen client={fetchClient} />
}
