import { describe, expect, it } from 'vitest'
import type { PreferenceStorage } from '@/common/config/preferenceStorage'
import { isSidebarShortcut, readSidebarCollapsed, writeSidebarCollapsed } from './sidebarPreference'

function memoryStorage(): PreferenceStorage {
  const values = new Map<string, string>()
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => void values.set(key, value) }
}

const brokenStorage: PreferenceStorage = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

describe('sidebar preference', () => {
  it('remembers the collapsed state', () => {
    const storage = memoryStorage()
    expect(readSidebarCollapsed(storage)).toBe(false)
    writeSidebarCollapsed(storage, true)
    expect(readSidebarCollapsed(storage)).toBe(true)
    writeSidebarCollapsed(storage, false)
    expect(readSidebarCollapsed(storage)).toBe(false)
  })

  it('falls back to expanded when storage is missing or blocked', () => {
    expect(readSidebarCollapsed(undefined)).toBe(false)
    expect(readSidebarCollapsed(brokenStorage)).toBe(false)
    expect(() => writeSidebarCollapsed(brokenStorage, true)).not.toThrow()
  })
})

describe('isSidebarShortcut', () => {
  const key = (init: Partial<Parameters<typeof isSidebarShortcut>[0]>) =>
    isSidebarShortcut({ key: '[', ctrlKey: false, metaKey: false, altKey: false, target: document.body, ...init })

  it('accepts [ on its own', () => {
    expect(key({})).toBe(true)
  })

  it('ignores other keys and modifiers', () => {
    expect(key({ key: ']' })).toBe(false)
    expect(key({ metaKey: true })).toBe(false)
    expect(key({ ctrlKey: true })).toBe(false)
    expect(key({ altKey: true })).toBe(false)
  })

  it('ignores typing in a field', () => {
    expect(key({ target: document.createElement('input') })).toBe(false)
    expect(key({ target: document.createElement('textarea') })).toBe(false)
  })
})
