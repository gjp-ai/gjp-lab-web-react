import { useState } from 'react'
import { browserStorage, type PreferenceStorage } from '@/common/config/preferenceStorage'

const collapsedKey = 'gjpLab.sidebarCollapsed'

/**
 * Whether the desktop sidebar was left collapsed. Storage can be missing or throw (private windows,
 * blocked site data), so any failure means "expanded".
 */
export function readSidebarCollapsed(storage: PreferenceStorage | undefined): boolean {
  try {
    return storage?.getItem(collapsedKey) === 'true'
  } catch {
    return false
  }
}

/** Remembers the choice; a storage failure only means it is forgotten after a reload. */
export function writeSidebarCollapsed(storage: PreferenceStorage | undefined, isCollapsed: boolean): void {
  try {
    storage?.setItem(collapsedKey, String(isCollapsed))
  } catch {
    // Nothing to do: the sidebar still works for this page view.
  }
}

/** The `[` key with no modifiers, unless the person is typing in a field. */
export function isSidebarShortcut(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'target'>): boolean {
  if (event.key !== '[' || event.ctrlKey || event.metaKey || event.altKey) return false
  const target = event.target
  if (!(target instanceof HTMLElement)) return true
  return !target.isContentEditable && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/** The collapsed state, read from and saved to this browser's local storage. */
export function useSidebarCollapsed(): [boolean, (isCollapsed: boolean) => void] {
  const [isCollapsed, setIsCollapsed] = useState(() => readSidebarCollapsed(browserStorage()))
  const update = (next: boolean) => {
    setIsCollapsed(next)
    writeSidebarCollapsed(browserStorage(), next)
  }
  return [isCollapsed, update]
}

