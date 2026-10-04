/** The HTTP methods the fetch sample offers; POST and PUT carry a JSON payload. */
export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const

export type HttpMethod = (typeof httpMethods)[number]

export function supportsPayload(method: HttpMethod): boolean {
  return method === 'POST' || method === 'PUT'
}

/** A completed response, carried to the response screen. */
export interface HttpResponse {
  status: number
  body: string
  /** Header name and value pairs, sorted by name. */
  headers: [string, string][]
}
