import axios, { type AxiosAdapter, type AxiosResponse } from 'axios'
import type { HttpMethod, HttpResponse } from '@/features/httpclient/shared/HttpResponse'
import {
  HttpRequestError,
  networkFailureMessage,
  parseHttpUrl,
  prettyJson,
  requestBody,
  requestHeaders,
  requestTimeoutMs,
  sortHeaders,
  timeoutMessage,
  utf8Size,
} from '@/features/httpclient/shared/httpRequest'

/**
 * One axios instance for the topic, configured once instead of on every call:
 * - `timeout` replaces the AbortSignal.timeout that fetch needs.
 * - `validateStatus` resolves every status. By default axios rejects anything outside 2xx; the lab wants
 *   to show 404 and 500 responses like any other.
 * - `responseType: 'text'` and an identity `transformResponse` keep the raw body. By default axios parses
 *   JSON into `response.data`; the lab measures and pretty-prints the text itself.
 */
const http = axios.create({
  timeout: requestTimeoutMs,
  validateStatus: () => true,
  responseType: 'text',
  transformResponse: [(data: unknown) => data],
})

/**
 * Builds and sends one request with axios. Like the fetch version, every HTTP status resolves; only
 * network failures, timeouts, cancellation, and invalid URLs reject. `adapter` lets tests answer without
 * a network.
 */
export async function executeAxiosRequest(
  method: HttpMethod,
  urlText: string,
  payload: string,
  options: { signal?: AbortSignal; adapter?: AxiosAdapter } = {},
): Promise<HttpResponse> {
  const url = parseHttpUrl(urlText)
  const startedAt = performance.now()
  try {
    const response = await http.request<string>({
      method,
      url: url.href,
      headers: requestHeaders(method),
      // A JSON string is sent as it is; axios turns other text into a JSON string (in quotes).
      data: requestBody(method, payload),
      signal: options.signal,
      adapter: options.adapter,
    })
    const text = typeof response.data === 'string' ? response.data : ''
    return {
      status: response.status,
      body: prettyJson(text),
      headers: sortHeaders(headerEntries(response.headers)),
      durationMs: Math.round(performance.now() - startedAt),
      sizeBytes: utf8Size(text),
    }
  } catch (error) {
    // Cancelled by the caller (for example the user left the screen): pass it on unchanged.
    if (axios.isCancel(error)) throw error
    if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')) {
      throw new HttpRequestError(timeoutMessage)
    }
    throw new HttpRequestError(networkFailureMessage)
  }
}

/** axios keeps each header as a property; a repeated header can be an array. */
function headerEntries(headers: AxiosResponse['headers']): [string, string][] {
  return Object.entries(headers)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([name, value]): [string, string] => [name, Array.isArray(value) ? value.join(', ') : String(value)])
}
