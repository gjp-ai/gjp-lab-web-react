import { describe, expect, it } from 'vitest'
import { serializePolicy, sitePolicy } from '@/common/config/contentSecurityPolicy'
import { parsePolicy, reviewPolicy } from './policyReview'

const messages = (text: string) => reviewPolicy(text).map((finding) => `${finding.severity} ${finding.directive}: ${finding.message}`)

describe('parsePolicy', () => {
  it('reads directives and sources, ignoring case, blank parts, and repeats', () => {
    const policy = parsePolicy("Script-Src 'self'  https://cdn.example ;; script-src *; object-src 'none';")
    expect([...policy.keys()]).toEqual(['script-src', 'object-src'])
    expect(policy.get('script-src')).toEqual(["'self'", 'https://cdn.example'])
  })
})

describe('reviewPolicy', () => {
  it("finds no weaknesses in this site's policy", () => {
    expect(reviewPolicy(serializePolicy(sitePolicy, ['sha256-abc=']))).toEqual([{ severity: 'info', directive: '—', message: 'No common weaknesses found.' }])
  })

  it('flags an empty policy and a missing script rule', () => {
    expect(messages('')).toEqual(['high —: The policy is empty, so nothing is restricted.'])
    expect(messages("img-src 'self'")[0]).toMatch(/^high script-src: No script-src or default-src/)
  })

  it("flags 'unsafe-inline' unless a hash or nonce makes browsers ignore it", () => {
    expect(messages("script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'")[0]).toMatch(/^high script-src: 'unsafe-inline' lets/)
    expect(messages("script-src 'unsafe-inline' 'nonce-r4nd0m'; object-src 'none'; base-uri 'none'")).toContain(
      "info script-src: 'unsafe-inline' is ignored because a hash or nonce is present; it only helps very old browsers.",
    )
  })

  it('flags eval, any-host sources, and plain http, most serious first', () => {
    const found = messages("default-src 'self' 'unsafe-eval' https: data:; img-src http://images.example; object-src 'none'; base-uri 'self'")
    expect(found).toEqual([
      'high default-src: https: lets scripts load from any host.',
      'high default-src: data: lets scripts load from data: URLs.',
      "medium default-src: 'unsafe-eval' allows eval() and new Function(), which turn text into code.",
      'medium img-src: http://images.example allows plain http, which can be read or changed on the way.',
    ])
  })

  it('flags missing object-src and base-uri, and notes header-only or unknown directives', () => {
    const found = messages("script-src 'self'; frame-ancestors 'none'; scripts-src 'self'")
    expect(found).toContain("medium object-src: Plugins are allowed; set object-src 'none'.")
    expect(found.some((line) => line.startsWith('medium base-uri: No base-uri'))).toBe(true)
    expect(found).toContain('info frame-ancestors: frame-ancestors is ignored in a <meta> policy; send it in a Content-Security-Policy header.')
    expect(found).toContain('info scripts-src: scripts-src is not a directive browsers know, so it is ignored.')
  })
})
