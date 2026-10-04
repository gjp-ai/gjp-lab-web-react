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
 * Builds and sends one request with the browser's fetch API. It owns the 15-second timeout, cancellation,
 * timing, and error messages; the shared helpers validate the URL and format the result, so the screen
 * only shows state. Every HTTP status resolves (fetch does not reject on 404 or 500); only network
 * failures, timeouts, cancellation, and invalid URLs reject.
 */
export async function executeRequest(
  method: HttpMethod,
  urlText: string,
  payload: string,
  options: { signal?: AbortSignal; fetchImpl?: typeof fetch } = {},
): Promise<HttpResponse> {
  const url = parseHttpUrl(urlText)

  // Stop after the timeout, or earlier if the caller cancels (for example the user leaves the screen).
  const timeout = AbortSignal.timeout(requestTimeoutMs)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout

  const startedAt = performance.now()
  let response: Response
  try {
    response = await (options.fetchImpl ?? fetch)(url, {
      method,
      headers: requestHeaders(method),
      body: requestBody(method, payload),
      signal,
    })
  } catch (error) {
    if (timeout.aborted) throw new HttpRequestError(timeoutMessage)
    if (options.signal?.aborted) throw error
    throw new HttpRequestError(networkFailureMessage)
  }

  // fetch gives the body as a stream; reading it as text waits for all of it.
  const text = await response.text()
  return {
    status: response.status,
    body: prettyJson(text),
    headers: sortHeaders(response.headers.entries()),
    durationMs: Math.round(performance.now() - startedAt),
    sizeBytes: utf8Size(text),
  }
}
