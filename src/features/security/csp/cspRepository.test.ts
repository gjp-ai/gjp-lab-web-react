import { afterEach, describe, expect, it, vi } from 'vitest'
import { browserProbes, readDeliveredPolicy, watchViolations } from './cspRepository'

afterEach(() => {
  document.head.querySelector('meta[http-equiv]')?.remove()
})

describe('readDeliveredPolicy', () => {
  it('reads the <meta> policy, or reports none', () => {
    expect(readDeliveredPolicy()).toBeUndefined()
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = "default-src 'self'"
    document.head.append(meta)
    expect(readDeliveredPolicy()).toBe("default-src 'self'")
  })
})

describe('watchViolations', () => {
  it('reports the directive and what was blocked, until stopped', () => {
    const target = new EventTarget()
    const onViolation = vi.fn()
    const stop = watchViolations(onViolation, target)
    // jsdom has no SecurityPolicyViolationEvent; an Event with the same fields stands in for it.
    target.dispatchEvent(Object.assign(new Event('securitypolicyviolation'), { effectiveDirective: 'script-src-elem', blockedURI: 'inline' }))
    expect(onViolation).toHaveBeenCalledWith({ directive: 'script-src-elem', blocked: 'inline' })
    stop()
    target.dispatchEvent(new Event('securitypolicyviolation'))
    expect(onViolation).toHaveBeenCalledTimes(1)
  })
})

describe('browserProbes', () => {
  it('runs eval-like code when no policy forbids it', () => {
    expect(browserProbes().evaluate()).toBe('ran')
  })
})
