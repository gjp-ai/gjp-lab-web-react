import { describe, expect, it } from 'vitest'
import type { PreferenceStorage } from '@/common/config/preferenceStorage'
import { defaultHideContentSettings, readHideContentSettings, writeHideContentSettings } from './hideContentSettings'

function memoryStorage(initial?: string): PreferenceStorage {
  const values = new Map<string, string>(initial === undefined ? [] : [['gjpLab.hideContent', initial]])
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

describe('hide content settings', () => {
  it('starts with hiding when the page is hidden, and nothing else', () => {
    expect(readHideContentSettings(memoryStorage())).toEqual({ whenHidden: true, whenUnfocused: false, untilShown: false })
  })

  it('remembers the settings', () => {
    const storage = memoryStorage()
    const settings = { whenHidden: false, whenUnfocused: true, untilShown: true }
    writeHideContentSettings(storage, settings)
    expect(readHideContentSettings(storage)).toEqual(settings)
  })

  it('uses the default for each field that is missing or not a boolean', () => {
    expect(readHideContentSettings(memoryStorage('{"whenHidden":false,"whenUnfocused":"yes"}'))).toEqual({
      whenHidden: false,
      whenUnfocused: false,
      untilShown: false,
    })
  })

  it('falls back to the defaults for unreadable text, missing storage, or blocked storage', () => {
    for (const text of ['not json', 'null', '42', '"true"']) expect(readHideContentSettings(memoryStorage(text)), text).toEqual(defaultHideContentSettings)
    expect(readHideContentSettings(undefined)).toEqual(defaultHideContentSettings)
    expect(readHideContentSettings(brokenStorage)).toEqual(defaultHideContentSettings)
    expect(() => writeHideContentSettings(brokenStorage, defaultHideContentSettings)).not.toThrow()
  })
})
