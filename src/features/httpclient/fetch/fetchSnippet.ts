import { type HttpMethod, supportsPayload } from './HttpResponse'

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
      const json = indentJson(payload)
      // executeRequest sends the payload text as typed; JSON is shown as JSON.stringify(...) for readability.
      options.push(json === undefined ? `  body: ${quote(payload)},` : `  body: JSON.stringify(${json}),`)
    }
  } else {
    options.push(`  headers: { Accept: 'application/json' },`)
  }
  return [
    `const response = await fetch(${quote(url.trim())}, {`,
    ...options,
    '})',
    '// fetch resolves for every HTTP status; check response.ok or response.status.',
    'const text = await response.text()',
  ].join('\n')
}

/** A single-quoted JavaScript string, escaping backslashes, quotes, and line breaks. */
function quote(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

/** Valid JSON re-indented to sit inside the options object, or `undefined` when the payload is not JSON. */
function indentJson(payload: string): string | undefined {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2).replace(/\n/g, '\n  ')
  } catch {
    return undefined
  }
}
