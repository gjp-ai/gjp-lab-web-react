import { describe, expect, it } from 'vitest'
import { buildAxiosSnippet } from './axiosSnippet'

describe('buildAxiosSnippet', () => {
  it('uses the method helper without headers or a body for GET and DELETE', () => {
    expect(buildAxiosSnippet('GET', ' https://jsonplaceholder.typicode.com/posts/1 ', '{"ignored":true}')).toBe(
      [
        "import axios from 'axios'",
        '',
        "const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1')",
        '// axios rejects for statuses outside 2xx (see validateStatus), and parses JSON into response.data.',
        'const data = response.data',
      ].join('\n'),
    )
    expect(buildAxiosSnippet('DELETE', 'https://example.com/1', '')).toContain("axios.delete('https://example.com/1')")
  })

  it('passes a JSON payload as an object, and other text as a string', () => {
    expect(buildAxiosSnippet('POST', 'https://example.com', '{"title":"Hi"}')).toContain(
      "await axios.post('https://example.com', {\n  \"title\": \"Hi\"\n})",
    )
    expect(buildAxiosSnippet('PUT', 'https://example.com', 'plain')).toContain("await axios.put('https://example.com', 'plain')")
  })
})
