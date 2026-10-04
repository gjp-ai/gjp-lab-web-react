import { useEffect, useState } from 'react'
import { browserStorage, type PreferenceStorage } from '@/common/config/preferenceStorage'

export type ColorScheme = 'light' | 'dark'

/** The local storage key; `index.html` reads the same key to apply the choice before the first paint. */
export const colorSchemeKey = 'gjpLab.colorScheme'

const systemDarkQuery = '(prefers-color-scheme: dark)'

/** The scheme the person chose, or `undefined` to follow the system. Blocked storage means "follow the system". */
export function readColorScheme(storage: PreferenceStorage | undefined): ColorScheme | undefined {
  try {
    const value = storage?.getItem(colorSchemeKey)
    return value === 'light' || value === 'dark' ? value : undefined
  } catch {
    return undefined
  }
}

/** Remembers the choice; a storage failure only means it is forgotten after a reload. */
export function writeColorScheme(storage: PreferenceStorage | undefined, scheme: ColorScheme): void {
  try {
    storage?.setItem(colorSchemeKey, scheme)
  } catch {
    // Nothing to do: the page keeps the scheme until it is reloaded.
  }
}

/**
 * The scheme in use and a function that switches to the other one. Until the person switches, it
 * follows the system setting, including changes while the page is open. A choice is saved and set as
 * `data-theme` on `<html>`, which `theme.css` uses in place of the system setting.
 */
export function useColorScheme(): [ColorScheme, () => void] {
  const [chosen, setChosen] = useState(() => readColorScheme(browserStorage()))
  const [system, setSystem] = useState(readSystemScheme)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(systemDarkQuery)
    const onChange = () => setSystem(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const scheme = chosen ?? system
  const toggle = () => {
    const next: ColorScheme = scheme === 'dark' ? 'light' : 'dark'
    setChosen(next)
    writeColorScheme(browserStorage(), next)
    document.documentElement.dataset.theme = next
  }
  return [scheme, toggle]
}

// jsdom has no matchMedia; treat that environment as light.
function readSystemScheme(): ColorScheme {
  return typeof window.matchMedia === 'function' && window.matchMedia(systemDarkQuery).matches ? 'dark' : 'light'
}
