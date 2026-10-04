/** The HTTP methods the fetch sample offers; POST and PUT carry a JSON payload. */
export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const

export type HttpMethod = (typeof httpMethods)[number]

export function supportsPayload(method: HttpMethod): boolean {
  return method === 'POST' || method === 'PUT'
}

/** A completed response, shown under the request on the fetch page. */
export interface HttpResponse {
  status: number
  body: string
  /** Header name and value pairs, sorted by name. */
  headers: [string, string][]
  /** Time from sending the request to reading the whole body, in milliseconds. */
  durationMs: number
  /** Size of the body as received, in bytes (UTF-8). */
  sizeBytes: number
}

const reasonPhrases: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  418: 'I’m a teapot',
  422: 'Unprocessable Content',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
}

/**
 * The standard reason phrase for a status ("Not Found"), or "" for an uncommon one. HTTP/2 responses
 * carry no status text, so `response.statusText` is often empty in the browser.
 */
export function reasonPhrase(status: number): string {
  return reasonPhrases[status] ?? ''
}

/** "512 B", "1.5 KB", or "2.3 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
