/** Whether the page can be seen, and whether its window has keyboard focus. */
export interface PageActivity {
  isVisible: boolean
  hasFocus: boolean
}

/** What changed: the page was hidden or shown, or its window lost or gained focus. */
export type PageActivityEvent = 'hidden' | 'visible' | 'blur' | 'focus'

/** The parts of the browser this feature reads, so tests can pass a fake. */
export interface PageEnvironment {
  document: EventTarget & { readonly visibilityState: DocumentVisibilityState; hasFocus(): boolean }
  window: EventTarget
}

export function readPageActivity(environment: PageEnvironment = { document, window }): PageActivity {
  return { isVisible: environment.document.visibilityState === 'visible', hasFocus: environment.document.hasFocus() }
}

/**
 * Calls `onChange` when the page is hidden or shown (`visibilitychange`: another tab, a minimised window, a
 * locked screen, or another app) and when its window loses or gains focus. Returns a function that stops
 * listening, for an effect's cleanup.
 */
export function watchPageActivity(
  onChange: (activity: PageActivity, event: PageActivityEvent) => void,
  environment: PageEnvironment = { document, window },
): () => void {
  const onVisibilityChange = () => {
    const activity = readPageActivity(environment)
    onChange(activity, activity.isVisible ? 'visible' : 'hidden')
  }
  // The event itself says which way focus went, so it does not depend on when hasFocus() catches up.
  const onBlur = () => onChange({ ...readPageActivity(environment), hasFocus: false }, 'blur')
  const onFocus = () => onChange({ ...readPageActivity(environment), hasFocus: true }, 'focus')

  // Focus events from elements inside the page do not bubble, so these listeners hear only the window itself.
  environment.document.addEventListener('visibilitychange', onVisibilityChange)
  environment.window.addEventListener('blur', onBlur)
  environment.window.addEventListener('focus', onFocus)
  return () => {
    environment.document.removeEventListener('visibilitychange', onVisibilityChange)
    environment.window.removeEventListener('blur', onBlur)
    environment.window.removeEventListener('focus', onFocus)
  }
}
