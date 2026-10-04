import { describe, expect, it } from 'vitest'
import type { PreferenceStorage } from '@/common/config/preferenceStorage'
import { colorSchemeKey, readColorScheme, writeColorScheme } from './colorScheme'

function memoryStorage(initial: Record<string, string> = {}): PreferenceStorage {
  const values = new Map(Object.entries(initial))
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => void values.set(key, value) }
}

describe('colour scheme preference', () => {
  it('follows the system until a scheme is saved', () => {
    const storage = memoryStorage()
    expect(readColorScheme(storage)).toBeUndefined()
    writeColorScheme(storage, 'dark')
    expect(readColorScheme(storage)).toBe('dark')
    writeColorScheme(storage, 'light')
    expect(readColorScheme(storage)).toBe('light')
  })

  it('ignores an unknown saved value', () => {
    expect(readColorScheme(memoryStorage({ [colorSchemeKey]: 'sepia' }))).toBeUndefined()
  })

  it('follows the system when storage is missing or blocked', () => {
    const blocked: PreferenceStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(readColorScheme(undefined)).toBeUndefined()
    expect(readColorScheme(blocked)).toBeUndefined()
    expect(() => writeColorScheme(blocked, 'dark')).not.toThrow()
  })
})
