import type { PreferenceStorage } from '@/common/config/preferenceStorage'

/** When the sample content is hidden. Saved in this browser. */
export interface HideContentSettings {
  /** Hide while the page is hidden: another tab, a minimised window, a locked screen, or another app. */
  whenHidden: boolean
  /** Also hide while the window does not have focus, for example behind another window in a screen share. */
  whenUnfocused: boolean
  /** After the page returns, keep the content hidden until the person shows it. */
  untilShown: boolean
}

export const defaultHideContentSettings: HideContentSettings = { whenHidden: true, whenUnfocused: false, untilShown: false }

const settingsKey = 'gjpLab.hideContent'

/**
 * The saved settings. Storage can be missing or throw, and the saved text can be anything, so each field
 * that is not a boolean falls back to its default.
 */
export function readHideContentSettings(storage: PreferenceStorage | undefined): HideContentSettings {
  try {
    const text = storage?.getItem(settingsKey)
    if (text === null || text === undefined) return defaultHideContentSettings
    const saved: unknown = JSON.parse(text)
    if (typeof saved !== 'object' || saved === null) return defaultHideContentSettings
    const fields = saved as Partial<Record<keyof HideContentSettings, unknown>>
    const pick = (key: keyof HideContentSettings) => {
      const value = fields[key]
      return typeof value === 'boolean' ? value : defaultHideContentSettings[key]
    }
    return { whenHidden: pick('whenHidden'), whenUnfocused: pick('whenUnfocused'), untilShown: pick('untilShown') }
  } catch {
    return defaultHideContentSettings
  }
}

/** Remembers the settings; a storage failure only means they are forgotten after a reload. */
export function writeHideContentSettings(storage: PreferenceStorage | undefined, settings: HideContentSettings): void {
  try {
    storage?.setItem(settingsKey, JSON.stringify(settings))
  } catch {
    // Nothing to do: the settings still apply to this page view.
  }
}
