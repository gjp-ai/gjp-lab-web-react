import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { HttpRequestError } from '@/features/httpclient/shared/httpRequest'
import { executeAxiosRequest } from './axiosRepository'

/** An adapter answers instead of the network, the way axios's own browser adapter would. */
function answer(status: number, data: string, headers: Record<string, string> = {}) {
  return vi.fn<AxiosAdapter>(async (config) => ({ status, statusText: '', data, headers, config }))
}

describe('executeAxiosRequest', () => {
  it('resolves any HTTP status with a formatted body, sorted headers, and the size', async () => {
    const adapter = answer(404, '{"error":"missing"}', { 'X-Zeta': 'z', 'Content-Type': 'application/json' })
    const response = await executeAxiosRequest('GET', 'https://example.com/missing', '', { adapter })
    expect(response.status).toBe(404)
    expect(response.body).toBe('{\n  "error": "missing"\n}')
    expect(response.headers.map(([name]) => name)).toEqual(['content-type', 'x-zeta'])
    expect(response.sizeBytes).toBe(19)
  })

  it('sends JSON headers, and the payload only for POST and PUT', async () => {
    const adapter = answer(200, '')
    await executeAxiosRequest('POST', 'https://example.com', ' {"a":1} ', { adapter })
    await executeAxiosRequest('GET', 'https://example.com', '{"a":1}', { adapter })
    const post = adapter.mock.calls[0][0] as InternalAxiosRequestConfig
    const get = adapter.mock.calls[1][0] as InternalAxiosRequestConfig
    expect(post.method).toBe('post')
    expect(post.data).toBe('{"a":1}')
    expect(post.headers['Content-Type']).toBe('application/json; charset=utf-8')
    expect(get.data).toBeUndefined()
    expect(get.headers.Accept).toBe('application/json')
  })

  it('turns a payload that is not JSON into a JSON string, as axios does', async () => {
    const adapter = answer(200, '')
    await executeAxiosRequest('PUT', 'https://example.com', 'hello', { adapter })
    expect((adapter.mock.calls[0][0] as InternalAxiosRequestConfig).data).toBe('"hello"')
  })

  it('reports a timeout and a network failure with readable messages', async () => {
    const timeout: AxiosAdapter = async (config) => {
      throw new AxiosError('timeout of 15000ms exceeded', 'ECONNABORTED', config)
    }
    await expect(executeAxiosRequest('GET', 'https://example.com', '', { adapter: timeout })).rejects.toThrow('timed out after 15 seconds')

    const offline: AxiosAdapter = async (config) => {
      throw new AxiosError('Network Error', 'ERR_NETWORK', config)
    }
    const failure = executeAxiosRequest('GET', 'https://example.com', '', { adapter: offline })
    await expect(failure).rejects.toThrow(HttpRequestError)
    await expect(failure).rejects.toThrow(/CORS/)
  })

  it('passes cancellation on, and never calls the network for an invalid URL', async () => {
    const adapter = answer(200, '')
    const controller = new AbortController()
    controller.abort()
    await expect(executeAxiosRequest('GET', 'https://example.com', '', { adapter, signal: controller.signal })).rejects.toMatchObject({
      name: 'CanceledError',
    })
    await expect(executeAxiosRequest('GET', 'not a url', '', { adapter })).rejects.toThrow('valid http:// or https:// URL')
    expect(adapter).not.toHaveBeenCalled()
  })
})
