import { type HttpMethod, type HttpResponse, supportsPayload } from './HttpResponse'

/** Requests give up after this long. */
export const requestTimeoutMs = 15_000

/** A request that could not be sent or read, with a message for the user. */
export class FetchRepositoryError extends Error {}

/**
 * Builds and sends one request with the browser's fetch API. It owns URL validation, the 15-second
 * timeout, JSON headers, pretty-printing, and header sorting, so the screen only shows state. Every
 * HTTP status resolves (fetch does not reject on 404 or 500); only network failures, timeouts,
 * cancellation, and invalid URLs reject.
 */
export async function executeRequest(
  method: HttpMethod,
  urlText: string,
  payload: string,
  options: { signal?: AbortSignal; fetchImpl?: typeof fetch } = {},
): Promise<HttpResponse> {
  const url = parseHttpUrl(urlText)
  const headers: Record<string, string> = { Accept: 'application/json' }
  let body: string | undefined
  if (supportsPayload(method)) {
    headers['Content-Type'] = 'application/json; charset=utf-8'
    if (payload.trim() !== '') body = payload
  }

  // Stop after the timeout, or earlier if the caller cancels (for example the user leaves the screen).
  const timeout = AbortSignal.timeout(requestTimeoutMs)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout

  let response: Response
  try {
    response = await (options.fetchImpl ?? fetch)(url, { method, headers, body, signal })
  } catch (error) {
    if (timeout.aborted) throw new FetchRepositoryError('The request timed out after 15 seconds.')
    if (options.signal?.aborted) throw error
    // Browsers report network errors and CORS rejections the same way, without details.
    throw new FetchRepositoryError('The request failed. Check the network, the URL, and whether the server allows requests from this site (CORS).')
  }

  const text = await response.text()
  const sortedHeaders = [...response.headers.entries()].sort(([a], [b]) => a.localeCompare(b))
  return { status: response.status, body: prettyJson(text), headers: sortedHeaders }
}

/** Accepts only http:// and https:// URLs, ignoring surrounding whitespace. */
export function parseHttpUrl(urlText: string): URL {
  try {
    const url = new URL(urlText.trim())
    if (url.protocol === 'http:' || url.protocol === 'https:') return url
  } catch {
    // Not a URL at all; fall through to the same message.
  }
  throw new FetchRepositoryError('Please enter a valid http:// or https:// URL.')
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
