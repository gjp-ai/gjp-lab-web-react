/** The part of `Storage` a saved preference needs, so tests can pass a fake. */
export interface PreferenceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/**
 * This browser's local storage, or `undefined` when it cannot be used: reading `window.localStorage`
 * itself throws when site data is blocked. Preferences are conveniences, so callers fall back to defaults.
 */
export function browserStorage(): PreferenceStorage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}
