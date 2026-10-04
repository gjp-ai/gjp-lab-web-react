import { describe, expect, it } from 'vitest'
import { describeChange, hideReasonFor, nextShield } from './contentShield'
import { defaultHideContentSettings, type HideContentSettings } from './hideContentSettings'

const inUse = { isVisible: true, hasFocus: true }
const hidden = { isVisible: false, hasFocus: false }
const unfocused = { isVisible: true, hasFocus: false }
const all: HideContentSettings = { whenHidden: true, whenUnfocused: true, untilShown: false }

describe('hideReasonFor', () => {
  it('hides a hidden page by default, and an unfocused one only when asked', () => {
    expect(hideReasonFor(hidden, defaultHideContentSettings)).toBe('hidden')
    expect(hideReasonFor(unfocused, defaultHideContentSettings)).toBeUndefined()
    expect(hideReasonFor(unfocused, all)).toBe('unfocused')
    expect(hideReasonFor(inUse, all)).toBeUndefined()
  })

  it('never hides when both are off', () => {
    const off = { whenHidden: false, whenUnfocused: false, untilShown: false }
    expect(hideReasonFor(hidden, off)).toBeUndefined()
    expect(hideReasonFor(unfocused, off)).toBeUndefined()
  })
})

describe('nextShield', () => {
  it('hides while the page is hidden and shows again when it is back', () => {
    const shield = nextShield(undefined, hidden, defaultHideContentSettings)
    expect(shield).toBe('hidden')
    expect(nextShield(shield, inUse, defaultHideContentSettings)).toBeUndefined()
  })

  it('keeps an automatic shield until shown when untilShown is on', () => {
    const settings = { ...defaultHideContentSettings, untilShown: true }
    expect(nextShield('hidden', inUse, settings)).toBe('hidden')
  })

  it('keeps a manual shield whatever the page does', () => {
    expect(nextShield('manual', hidden, all)).toBe('manual')
    expect(nextShield('manual', inUse, all)).toBe('manual')
  })

  it('names the stronger reason when both apply in turn', () => {
    // Switching tabs: the window loses focus, then the page is hidden, then it comes back unfocused for a moment.
    const afterBlur = nextShield(undefined, unfocused, all)
    expect(afterBlur).toBe('unfocused')
    const afterHide = nextShield(afterBlur, hidden, all)
    expect(afterHide).toBe('hidden')
    expect(nextShield(afterHide, unfocused, all)).toBe('hidden')
  })
})

describe('describeChange', () => {
  it('says what the page reported and what happened to the content', () => {
    expect(describeChange('hidden', undefined, 'hidden')).toBe('Page hidden: content hidden')
    expect(describeChange('visible', 'hidden', undefined)).toBe('Page visible: content shown')
    expect(describeChange('focus', 'hidden', 'hidden')).toBe('Window focused: content stays hidden')
    expect(describeChange('blur', undefined, undefined)).toBe('Window lost focus: content unchanged')
  })
})
