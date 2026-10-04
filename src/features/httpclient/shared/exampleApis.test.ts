import { describe, expect, it } from 'vitest'
import { exampleApis, restfulApiIdPlaceholder } from './exampleApis'
import { parseHttpUrl } from './httpRequest'
import { httpMethods, supportsPayload } from './HttpResponse'

describe('exampleApis', () => {
  it('lists each API once, starting with JSONPlaceholder', () => {
    expect(exampleApis.map((api) => api.name)).toEqual([
      'JSONPlaceholder',
      'DummyJSON',
      'ReqRes',
      'restful-api.dev',
      'httpbin',
      'Swagger Petstore',
      'PokeAPI',
    ])
    expect(new Set(exampleApis.map((api) => api.id)).size).toBe(exampleApis.length)
  })

  it('keeps every example on its own API host, over https, with a payload exactly for POST and PUT', () => {
    for (const api of exampleApis) {
      const docsHost = parseHttpUrl(api.docsUrl).hostname.replace(/^www\./, '')
      for (const preset of api.presets) {
        const url = parseHttpUrl(preset.url)
        expect(url.protocol).toBe('https:')
        expect(url.hostname.endsWith(docsHost.replace(/^api\./, ''))).toBe(true)
        if (supportsPayload(preset.method)) expect(() => JSON.parse(preset.payload)).not.toThrow()
        else expect(preset.payload).toBe('')
      }
      expect(new Set(api.presets.map((preset) => preset.label)).size).toBe(api.presets.length)
    }
  })

  it('covers every method, except for the read-only PokeAPI', () => {
    for (const api of exampleApis) {
      const methods = new Set(api.presets.map((preset) => preset.method))
      expect(methods).toEqual(api.id === 'pokeapi' ? new Set(['GET']) : new Set(httpMethods))
    }
  })

  it('explains the id placeholder wherever restful-api.dev uses it', () => {
    const restful = exampleApis.find((api) => api.id === 'restful-api')!
    expect(restful.description).toContain(restfulApiIdPlaceholder)
  })
})
