import { describe, expect, it, vi } from 'vitest'
import { type ClipboardEnvironment, copyText, readText, watchPermission } from './clipboardRepository'

class FakePermissionStatus extends EventTarget {
  name: PermissionName = 'geolocation'
  onchange = null
  state: PermissionState
  constructor(state: PermissionState) {
    super()
    this.state = state
  }
}

function fakeEnvironment(overrides: Partial<ClipboardEnvironment> = {}): ClipboardEnvironment {
  let text = ''
  return {
    clipboard: {
      writeText: async (value) => {
        text = value
      },
      readText: async () => text,
    },
    permissions: undefined,
    isSecureContext: true,
    ...overrides,
  }
}

const refusing = { writeText: () => Promise.reject(new DOMException('No.', 'NotAllowedError')), readText: () => Promise.reject(new DOMException('No.', 'NotAllowedError')) }

describe('copyText and readText', () => {
  it('writes text and reads it back', async () => {
    const environment = fakeEnvironment()
    expect(await copyText('hello', environment)).toEqual({ ok: true })
    expect(await readText(environment)).toEqual({ ok: true, text: 'hello' })
  })

  it('explains a refusal', async () => {
    const environment = fakeEnvironment({ clipboard: refusing })
    expect(await copyText('hello', environment)).toEqual({ ok: false, reason: expect.stringMatching(/writing needs a recent click/) })
    expect(await readText(environment)).toEqual({ ok: false, reason: expect.stringMatching(/permission was denied/) })
  })

  it('explains a missing Clipboard API, naming the secure page rule when that is the cause', async () => {
    expect(await copyText('x', fakeEnvironment({ clipboard: undefined, isSecureContext: false }))).toEqual({
      ok: false,
      reason: 'The Clipboard API works only on secure pages (HTTPS or localhost).',
    })
    expect(await readText(fakeEnvironment({ clipboard: undefined }))).toEqual({ ok: false, reason: 'This browser has no Clipboard API.' })
  })
})

describe('watchPermission', () => {
  it('reports the state, then each change, until stopped', async () => {
    const status = new FakePermissionStatus('prompt')
    const query = vi.fn(async () => status)
    const onState = vi.fn()
    const stop = watchPermission('clipboard-read', onState, fakeEnvironment({ permissions: { query } }))
    await vi.waitFor(() => expect(onState).toHaveBeenCalledWith('prompt'))
    expect(query).toHaveBeenCalledWith({ name: 'clipboard-read' })

    status.state = 'granted'
    status.dispatchEvent(new Event('change'))
    expect(onState).toHaveBeenLastCalledWith('granted')

    stop()
    status.dispatchEvent(new Event('change'))
    expect(onState).toHaveBeenCalledTimes(2)
  })

  it('reports unsupported when the browser does not know the permission or has no Permissions API', async () => {
    const onState = vi.fn()
    watchPermission('clipboard-write', onState, fakeEnvironment({ permissions: { query: () => Promise.reject(new TypeError('unknown name')) } }))
    await vi.waitFor(() => expect(onState).toHaveBeenCalledWith('unsupported'))

    const onMissing = vi.fn()
    watchPermission('clipboard-write', onMissing, fakeEnvironment())
    expect(onMissing).toHaveBeenCalledWith('unsupported')
  })
})
