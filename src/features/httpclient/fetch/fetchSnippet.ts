import { type HttpMethod, supportsPayload } from '@/features/httpclient/shared/HttpResponse'
import { indentJson, quoteJs } from '@/features/httpclient/shared/httpRequest'

/**
 * The fetch call for the request in the form, as a reader would write it by hand. It mirrors what
 * `executeRequest` sends (method, JSON headers, and the payload for POST and PUT), without the timeout
 * and error handling, so the essentials stay visible.
 */
export function buildFetchSnippet(method: HttpMethod, url: string, payload: string): string {
  const options: string[] = [`  method: '${method}',`]
  if (supportsPayload(method)) {
    options.push(`  headers: { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8' },`)
    if (payload.trim() !== '') {
      const json = indentJson(payload, '  ')
      // executeRequest sends the payload text as typed; JSON is shown as JSON.stringify(...) for readability.
      options.push(json === undefined ? `  body: ${quoteJs(payload)},` : `  body: JSON.stringify(${json}),`)
    }
  } else {
    options.push(`  headers: { Accept: 'application/json' },`)
  }
  return [
    `const response = await fetch(${quoteJs(url.trim())}, {`,
    ...options,
    '})',
    '// fetch resolves for every HTTP status; check response.ok or response.status.',
    'const text = await response.text()',
  ].join('\n')
}
