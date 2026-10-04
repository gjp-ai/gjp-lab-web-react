import type { HideContentSettings } from './hideContentSettings'
import type { PageActivity, PageActivityEvent } from './pageActivityRepository'

/** Why the content is hidden; `undefined` means it is shown. */
export type HideReason = 'hidden' | 'unfocused' | 'manual'

export const hideReasonText: Record<HideReason, string> = {
  hidden: 'Hidden because the page went into the background.',
  unfocused: 'Hidden because the window lost focus.',
  manual: 'Hidden with Hide now.',
}

// A stronger reason replaces a weaker one, so the placeholder names the most telling cause.
const strength: Record<HideReason, number> = { unfocused: 1, hidden: 2, manual: 3 }

/** Whether the page's state calls for hiding, and why. */
export function hideReasonFor(activity: PageActivity, settings: HideContentSettings): HideReason | undefined {
  if (settings.whenHidden && !activity.isVisible) return 'hidden'
  if (settings.whenUnfocused && !activity.hasFocus) return 'unfocused'
  return undefined
}

/**
 * The shield after the page's activity changes. The page lifts a shield it put up once it is back in use,
 * unless `untilShown` leaves that to the person; a shield the person put up (`manual`) stays until they lift it.
 */
export function nextShield(current: HideReason | undefined, activity: PageActivity, settings: HideContentSettings): HideReason | undefined {
  const reason = hideReasonFor(activity, settings)
  if (reason === undefined) return current === 'manual' || settings.untilShown ? current : undefined
  if (current === undefined) return reason
  return strength[reason] > strength[current] ? reason : current
}

const eventText: Record<PageActivityEvent, string> = {
  hidden: 'Page hidden',
  visible: 'Page visible',
  blur: 'Window lost focus',
  focus: 'Window focused',
}

/** One activity log line: what the page reported, and what that did to the content. */
export function describeChange(event: PageActivityEvent, before: HideReason | undefined, after: HideReason | undefined): string {
  return `${eventText[event]}: ${outcome(before, after)}`
}

function outcome(before: HideReason | undefined, after: HideReason | undefined): string {
  if (before === undefined) return after === undefined ? 'content unchanged' : 'content hidden'
  return after === undefined ? 'content shown' : 'content stays hidden'
}
