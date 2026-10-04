import { describe, expect, it } from 'vitest'
import { browserName, readBrowserInfo, type BrowserEnvironment } from './browserInfoRepository'

const chrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

describe('browserName', () => {
  it('names common browsers, checking the more specific ones first', () => {
    expect(browserName(chrome)).toBe('Chrome 140')
    expect(browserName(`${chrome} Edg/140.0.0.0`)).toBe('Edge 140')
    expect(browserName('Mozilla/5.0 (Macintosh) Gecko/20100101 Firefox/143.0')).toBe('Firefox 143')
    expect(browserName('Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1')).toBe('Safari 26')
    expect(browserName('curl/8.0')).toBe('Unknown')
  })
})

describe('readBrowserInfo', () => {
  it('reads the browser and device sections from the environment', () => {
    const environment: BrowserEnvironment = {
      navigator: { userAgent: chrome, language: 'en-SG', onLine: true, cookieEnabled: true, hardwareConcurrency: 8, maxTouchPoints: 0, deviceMemory: 8 },
      screen: { width: 1512, height: 982, colorDepth: 30 },
      devicePixelRatio: 2,
      matchMedia: (query) => ({ matches: query.includes('dark') }),
    }
    const info = readBrowserInfo(environment)
    expect(info.browser).toContainEqual({ label: 'Browser', value: 'Chrome 140' })
    expect(info.browser).toContainEqual({ label: 'Colour scheme', value: 'Dark' })
    expect(info.browser).toContainEqual({ label: 'Reduced motion', value: 'Off' })
    expect(info.device).toContainEqual({ label: 'Screen', value: '1512 × 982 CSS px' })
    expect(info.device).toContainEqual({ label: 'Memory', value: 'about 8 GB' })
  })

  it('says when memory is not reported', () => {
    const info = readBrowserInfo({
      navigator: { userAgent: '', language: 'en', onLine: false, cookieEnabled: false, hardwareConcurrency: 4, maxTouchPoints: 5 },
      screen: { width: 390, height: 844, colorDepth: 24 },
      devicePixelRatio: 3,
      matchMedia: () => ({ matches: false }),
    })
    expect(info.device).toContainEqual({ label: 'Memory', value: 'Not reported' })
    expect(info.browser).toContainEqual({ label: 'Online', value: 'No' })
  })
})
