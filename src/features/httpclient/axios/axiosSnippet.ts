import { type HttpMethod, supportsPayload } from '@/features/httpclient/shared/HttpResponse'
import { indentJson, quoteJs } from '@/features/httpclient/shared/httpRequest'

/**
 * The axios call for the request in the form, written the way axios is usually used: a method helper
 * (`axios.get`, `axios.post`, …) and a plain object as the body. axios sets the JSON headers and parses
 * the JSON response itself, so the snippet needs neither.
 */
export function buildAxiosSnippet(method: HttpMethod, url: string, payload: string): string {
  const call = `axios.${method.toLowerCase()}`
  const target = quoteJs(url.trim())
  let line = `const response = await ${call}(${target})`
  if (supportsPayload(method) && payload.trim() !== '') {
    const json = indentJson(payload, '')
    line = `const response = await ${call}(${target}, ${json ?? quoteJs(payload)})`
  }
  return [
    "import axios from 'axios'",
    '',
    line,
    '// axios rejects for statuses outside 2xx (see validateStatus), and parses JSON into response.data.',
    'const data = response.data',
  ].join('\n')
}
