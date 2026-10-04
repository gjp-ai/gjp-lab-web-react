import { describe, expect, it, vi } from 'vitest'
import { type PageEnvironment, readPageActivity, watchPageActivity } from './pageActivityRepository'

/** A page whose visibility and focus the test sets, then announces with the events a browser would fire. */
class FakeDocument extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible'
  focused = true
  hasFocus() {
    return this.focused
  }
}

function fakePage() {
  const page = { document: new FakeDocument(), window: new EventTarget() } satisfies PageEnvironment
  const setVisible = (isVisible: boolean) => {
    page.document.visibilityState = isVisible ? 'visible' : 'hidden'
    page.document.dispatchEvent(new Event('visibilitychange'))
  }
  return { page, setVisible }
}

describe('readPageActivity', () => {
  it('reads visibility and focus', () => {
    const { page } = fakePage()
    expect(readPageActivity(page)).toEqual({ isVisible: true, hasFocus: true })
    page.document.visibilityState = 'hidden'
    page.document.focused = false
    expect(readPageActivity(page)).toEqual({ isVisible: false, hasFocus: false })
  })
})

describe('watchPageActivity', () => {
  it('reports the page being hidden and shown', () => {
    const { page, setVisible } = fakePage()
    const onChange = vi.fn()
    watchPageActivity(onChange, page)
    page.document.focused = false
    setVisible(false)
    expect(onChange).toHaveBeenLastCalledWith({ isVisible: false, hasFocus: false }, 'hidden')
    setVisible(true)
    expect(onChange).toHaveBeenLastCalledWith({ isVisible: true, hasFocus: false }, 'visible')
  })

  it('takes focus from the window event, even before hasFocus() catches up', () => {
    const { page } = fakePage()
    const onChange = vi.fn()
    watchPageActivity(onChange, page)
    page.window.dispatchEvent(new Event('blur'))
    expect(onChange).toHaveBeenLastCalledWith({ isVisible: true, hasFocus: false }, 'blur')
    page.document.focused = false
    page.window.dispatchEvent(new Event('focus'))
    expect(onChange).toHaveBeenLastCalledWith({ isVisible: true, hasFocus: true }, 'focus')
  })

  it('stops listening after cleanup', () => {
    const { page, setVisible } = fakePage()
    const onChange = vi.fn()
    const stop = watchPageActivity(onChange, page)
    stop()
    setVisible(false)
    page.window.dispatchEvent(new Event('blur'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
