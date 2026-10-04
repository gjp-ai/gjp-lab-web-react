import { describe, expect, it } from 'vitest'
import { fetchMaintenanceMode } from './maintenanceMode'

const respond = (body: unknown, status = 200): typeof fetch =>
  async () => new Response(JSON.stringify(body), { status })

describe('fetchMaintenanceMode', () => {
  it('reads an enabled flag', async () => {
    expect(await fetchMaintenanceMode('/config.json', 1_000, respond({ maintenanceEnabled: true }))).toBe(true)
  })

  it('reads a disabled flag', async () => {
    expect(await fetchMaintenanceMode('/config.json', 1_000, respond({ maintenanceEnabled: false }))).toBe(false)
  })

  it('fails open on an HTTP error, bad JSON, or a missing flag', async () => {
    expect(await fetchMaintenanceMode('/config.json', 1_000, respond({ maintenanceEnabled: true }, 500))).toBe(false)
    expect(await fetchMaintenanceMode('/config.json', 1_000, async () => new Response('not json'))).toBe(false)
    expect(await fetchMaintenanceMode('/config.json', 1_000, respond({}))).toBe(false)
    expect(await fetchMaintenanceMode('/config.json', 1_000, respond({ maintenanceEnabled: 'yes' }))).toBe(false)
  })

  it('fails open when the network fails', async () => {
    const offline: typeof fetch = async () => {
      throw new TypeError('Failed to fetch')
    }
    expect(await fetchMaintenanceMode('/config.json', 1_000, offline)).toBe(false)
  })

  it('fails open when the server does not answer in time', async () => {
    // A fetch that never resolves unless its signal aborts.
    const hanging: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))
    expect(await fetchMaintenanceMode('/config.json', 20, hanging)).toBe(false)
  })
})
