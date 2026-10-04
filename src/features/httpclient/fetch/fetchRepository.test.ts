import { describe, expect, it, vi } from 'vitest'
import { executeRequest, FetchRepositoryError, parseHttpUrl, prettyJson } from './fetchRepository'

describe('parseHttpUrl', () => {
  it('accepts http and https, ignoring whitespace', () => {
    expect(parseHttpUrl('  https://example.com/api ').href).toBe('https://example.com/api')
    expect(parseHttpUrl('http://example.com').protocol).toBe('http:')
  })

  it('rejects other schemes and text that is not a URL', () => {
    for (const text of ['ftp://example.com', 'example.com', '', 'javascript:alert(1)']) {
      expect(() => parseHttpUrl(text), text).toThrow(FetchRepositoryError)
    }
  })
})

describe('prettyJson', () => {
  it('indents objects and arrays and leaves other text alone', () => {
    expect(prettyJson('{"a":1}')).toBe('{\n  "a": 1\n}')
    expect(prettyJson('[1]')).toBe('[\n  1\n]')
    expect(prettyJson('plain text')).toBe('plain text')
    expect(prettyJson('42')).toBe('42')
  })
})

describe('executeRequest', () => {
  it('returns any HTTP status with a formatted body and sorted headers', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response('{"error":"missing"}', { status: 404, headers: { 'X-Zeta': 'z', 'Content-Type': 'application/json' } }),
    )
    const response = await executeRequest('GET', 'https://example.com/missing', '', { fetchImpl })
    expect(response.status).toBe(404)
    expect(response.body).toBe('{\n  "error": "missing"\n}')
    expect(response.headers.map(([name]) => name)).toEqual(['content-type', 'x-zeta'])
  })

  it('sends JSON headers, and the payload only for POST and PUT', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(''))
    await executeRequest('POST', 'https://example.com', '{"a":1}', { fetchImpl })
    await executeRequest('GET', 'https://example.com', '{"a":1}', { fetchImpl })
    const post = fetchImpl.mock.calls[0][1] ?? {}
    const get = fetchImpl.mock.calls[1][1] ?? {}
    expect(post.body).toBe('{"a":1}')
    expect((post.headers as Record<string, string>)['Content-Type']).toBe('application/json; charset=utf-8')
    expect(get.body).toBeUndefined()
    expect((get.headers as Record<string, string>).Accept).toBe('application/json')
  })

  it('reports a network failure with a readable message', async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new TypeError('Failed to fetch')
    }
    await expect(executeRequest('GET', 'https://example.com', '', { fetchImpl })).rejects.toThrow(/CORS/)
  })

  it('never calls the network for an invalid URL', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
    await expect(executeRequest('GET', 'not a url', '', { fetchImpl })).rejects.toThrow('valid http:// or https:// URL')
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
