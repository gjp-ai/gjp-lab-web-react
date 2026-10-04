import { type HttpMethod, supportsPayload } from './HttpResponse'

/** Requests give up after this long. */
export const requestTimeoutMs = 15_000

/** A request that could not be sent or read, with a message for the user. */
export class HttpRequestError extends Error {}

export const timeoutMessage = `The request timed out after ${requestTimeoutMs / 1000} seconds.`

// Browsers report network errors and CORS rejections the same way, without details.
export const networkFailureMessage =
  'The request failed. Check the network, the URL, and whether the server allows requests from this site (CORS).'

/** Accepts only http:// and https:// URLs, ignoring surrounding whitespace. */
export function parseHttpUrl(urlText: string): URL {
  try {
    const url = new URL(urlText.trim())
    if (url.protocol === 'http:' || url.protocol === 'https:') return url
  } catch {
    // Not a URL at all; fall through to the same message.
  }
  throw new HttpRequestError('Please enter a valid http:// or https:// URL.')
}

/** `Accept: application/json` for every request, plus a JSON `Content-Type` for POST and PUT. */
export function requestHeaders(method: HttpMethod): Record<string, string> {
  return supportsPayload(method)
    ? { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8' }
    : { Accept: 'application/json' }
}

/** The payload text to send: only for POST and PUT, and only when it is not blank. */
export function requestBody(method: HttpMethod, payload: string): string | undefined {
  return supportsPayload(method) && payload.trim() !== '' ? payload : undefined
}

/** Pretty-prints JSON with two-space indentation; anything else is returned unchanged. */
export function prettyJson(text: string): string {
  try {
    const value: unknown = JSON.parse(text)
    return typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : text
  } catch {
    return text
  }
}

/** Header pairs with lower-case names, sorted by name. */
export function sortHeaders(entries: Iterable<[string, string]>): [string, string][] {
  return [...entries].map(([name, value]): [string, string] => [name.toLowerCase(), value]).sort(([a], [b]) => a.localeCompare(b))
}

/** The size of text in bytes when encoded as UTF-8, as it travels over the network. */
export function utf8Size(text: string): number {
  return new TextEncoder().encode(text).length
}

/** A single-quoted JavaScript string for code snippets, escaping backslashes, quotes, and line breaks. */
export function quoteJs(text: string): string {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

/** Valid JSON re-indented by `indent` for a code snippet, or `undefined` when the text is not JSON. */
export function indentJson(text: string, indent: string): string | undefined {
  try {
    return JSON.stringify(JSON.parse(text), null, 2).replace(/\n/g, `\n${indent}`)
  } catch {
    return undefined
  }
}
