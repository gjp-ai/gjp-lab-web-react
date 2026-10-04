import { describe, expect, it } from 'vitest'
import indexHtml from '../../../index.html?raw'
import { inlineScripts, serializePolicy, sitePolicy } from './contentSecurityPolicy'

describe('site Content Security Policy', () => {
  it('serializes each directive, adding script hashes to script-src only', () => {
    const text = serializePolicy(
      [
        { name: 'default-src', sources: ["'self'"], purpose: '' },
        { name: 'script-src', sources: ["'self'"], purpose: '' },
      ],
      ['sha256-abc='],
    )
    expect(text).toBe("default-src 'self'; script-src 'self' 'sha256-abc='")
  })

  it('allows no inline code, eval, plugins, or other script hosts', () => {
    const text = serializePolicy(sitePolicy)
    expect(text).toContain("script-src 'self'")
    expect(text).not.toMatch(/unsafe-inline|unsafe-eval/)
    expect(text).toContain("object-src 'none'")
    expect(text).toContain("base-uri 'none'")
    // A <meta> policy ignores these, and the browser warns about them in the console.
    expect(text).not.toMatch(/frame-ancestors|report-uri|report-to|sandbox/)
  })

  it('finds the inline scripts in index.html that need a hash, and skips scripts with src', () => {
    const scripts = inlineScripts(indexHtml)
    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toContain("localStorage.getItem('gjpLab.colorScheme')")
    expect(inlineScripts('<script type="module" src="/main.js"></script><SCRIPT>a()</SCRIPT>')).toEqual(['a()'])
  })
})
