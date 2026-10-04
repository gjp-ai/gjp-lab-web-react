import { describe, expect, it } from 'vitest'
import { HttpRequestError, indentJson, parseHttpUrl, prettyJson, quoteJs, requestBody, requestHeaders, sortHeaders, utf8Size } from './httpRequest'

describe('parseHttpUrl', () => {
  it('accepts http and https, ignoring whitespace', () => {
    expect(parseHttpUrl('  https://example.com/api ').href).toBe('https://example.com/api')
    expect(parseHttpUrl('http://example.com').protocol).toBe('http:')
  })

  it('rejects other schemes and text that is not a URL', () => {
    for (const text of ['ftp://example.com', 'example.com', '', 'javascript:alert(1)']) {
      expect(() => parseHttpUrl(text), text).toThrow(HttpRequestError)
    }
  })
})

describe('request headers and body', () => {
  it('sends JSON headers, and a non-blank payload only for POST and PUT', () => {
    expect(requestHeaders('GET')).toEqual({ Accept: 'application/json' })
    expect(requestHeaders('PUT')['Content-Type']).toBe('application/json; charset=utf-8')
    expect(requestBody('POST', '{"a":1}')).toBe('{"a":1}')
    expect(requestBody('POST', '  ')).toBeUndefined()
    expect(requestBody('DELETE', '{"a":1}')).toBeUndefined()
  })
})

describe('response helpers', () => {
  it('indents JSON objects and arrays and leaves other text alone', () => {
    expect(prettyJson('{"a":1}')).toBe('{\n  "a": 1\n}')
    expect(prettyJson('[1]')).toBe('[\n  1\n]')
    expect(prettyJson('plain text')).toBe('plain text')
    expect(prettyJson('42')).toBe('42')
  })

  it('lower-cases and sorts header names, and measures UTF-8 size', () => {
    expect(sortHeaders([['X-Zeta', 'z'], ['Content-Type', 'json']])).toEqual([['content-type', 'json'], ['x-zeta', 'z']])
    expect(utf8Size('é')).toBe(2)
  })
})

describe('snippet helpers', () => {
  it('quotes text as a JavaScript string and re-indents JSON', () => {
    expect(quoteJs("it's\na \\ path")).toBe("'it\\'s\\na \\\\ path'")
    expect(indentJson('{"a":1}', '  ')).toBe('{\n    "a": 1\n  }')
    expect(indentJson('{"a":', '')).toBeUndefined()
  })
})
