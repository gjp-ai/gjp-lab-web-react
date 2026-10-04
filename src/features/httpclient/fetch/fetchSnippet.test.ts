import { describe, expect, it } from 'vitest'
import { buildFetchSnippet } from './fetchSnippet'

describe('buildFetchSnippet', () => {
  it('writes a GET without a body', () => {
    expect(buildFetchSnippet('GET', ' https://jsonplaceholder.typicode.com/posts/1 ', '{"ignored":true}')).toBe(
      [
        "const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {",
        "  method: 'GET',",
        "  headers: { Accept: 'application/json' },",
        '})',
        '// fetch resolves for every HTTP status; check response.ok or response.status.',
        'const text = await response.text()',
      ].join('\n'),
    )
  })

  it('writes a JSON payload with JSON.stringify for POST and PUT', () => {
    const snippet = buildFetchSnippet('POST', 'https://example.com/posts', '{"title":"Hi","userId":1}')
    expect(snippet).toContain("'Content-Type': 'application/json; charset=utf-8'")
    expect(snippet).toContain('  body: JSON.stringify({\n    "title": "Hi",\n    "userId": 1\n  }),')
  })

  it('writes other payload text as an escaped string, and omits an empty one', () => {
    expect(buildFetchSnippet('PUT', 'https://example.com', "it's\nplain")).toContain("  body: 'it\\'s\\nplain',")
    expect(buildFetchSnippet('PUT', 'https://example.com', '  ')).not.toContain('body:')
  })
})
