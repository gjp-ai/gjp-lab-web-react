export interface InfoRow {
  label: string
  value: string
}

export interface BrowserInfo {
  browser: InfoRow[]
  device: InfoRow[]
}

/** The parts of the browser this screen reads, so tests can pass a fake. */
export interface BrowserEnvironment {
  navigator: Pick<Navigator, 'userAgent' | 'language' | 'onLine' | 'cookieEnabled' | 'hardwareConcurrency' | 'maxTouchPoints'> & {
    /** Chromium only; approximate RAM in GB, rounded for privacy. */
    deviceMemory?: number
  }
  screen: Pick<Screen, 'width' | 'height' | 'colorDepth'>
  devicePixelRatio: number
  matchMedia: (query: string) => { matches: boolean }
}

/**
 * Reads a snapshot of the browser and device. It never reads identifiers or anything that identifies
 * the user, and needs no permission.
 */
export function readBrowserInfo(environment: BrowserEnvironment = window): BrowserInfo {
  const { navigator, screen } = environment
  return {
    browser: [
      { label: 'Browser', value: browserName(navigator.userAgent) },
      { label: 'Language', value: navigator.language },
      { label: 'Online', value: navigator.onLine ? 'Yes' : 'No' },
      { label: 'Cookies', value: navigator.cookieEnabled ? 'Enabled' : 'Disabled' },
      { label: 'Colour scheme', value: environment.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light' },
      { label: 'Reduced motion', value: environment.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'On' : 'Off' },
    ],
    device: [
      { label: 'Screen', value: `${screen.width} × ${screen.height} CSS px` },
      { label: 'Pixel ratio', value: `${environment.devicePixelRatio}×` },
      { label: 'Colour depth', value: `${screen.colorDepth}-bit` },
      { label: 'CPU cores', value: String(navigator.hardwareConcurrency || 'Unknown') },
      { label: 'Memory', value: navigator.deviceMemory === undefined ? 'Not reported' : `about ${navigator.deviceMemory} GB` },
      { label: 'Touch points', value: String(navigator.maxTouchPoints) },
    ],
  }
}

/**
 * A readable browser name from the user-agent string. Order matters: Edge and Opera include "Chrome",
 * and Chrome includes "Safari".
 */
export function browserName(userAgent: string): string {
  const rules: [RegExp, string][] = [
    [/Edg\/(\d+)/, 'Edge'],
    [/OPR\/(\d+)/, 'Opera'],
    [/Firefox\/(\d+)/, 'Firefox'],
    [/Chrome\/(\d+)/, 'Chrome'],
    [/Version\/(\d+).*Safari/, 'Safari'],
  ]
  for (const [pattern, name] of rules) {
    const match = pattern.exec(userAgent)
    if (match) return `${name} ${match[1]}`
  }
  return 'Unknown'
}
