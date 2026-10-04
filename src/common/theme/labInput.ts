/**
 * Classes for text inputs, selects, and text areas: a `surface` field with an `outline-variant` border
 * that turns `error` when `aria-invalid` is set, and a `primary` focus outline.
 */
export const labInputClassName =
  'min-h-11 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-base text-on-surface ' +
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary aria-invalid:border-error'
