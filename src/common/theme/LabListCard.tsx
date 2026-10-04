import type { ReactNode } from 'react'
import { Link } from 'react-router'

const base =
  'flex w-full items-center gap-3.5 rounded-[18px] bg-surface p-4 text-left text-on-surface ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary '

/**
 * A list row drawn as its own rounded card with a hairline border. A selected row gets a thicker
 * `primary` border, which is how the current category and topic stay visible when panes sit side by side.
 * With `to` the card is a link; without it the row is shown but cannot be opened (a planned topic).
 */
export function LabListCard({
  to,
  isSelected = false,
  label,
  children,
}: {
  to?: string
  isSelected?: boolean
  /** Accessible name for the link, when the visible text alone is not enough. */
  label?: string
  children: ReactNode
}) {
  const border = isSelected ? 'border border-primary' : 'border-[0.5px] border-outline-variant'
  if (to === undefined) {
    return <div className={base + border}>{children}</div>
  }
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={isSelected ? 'page' : undefined}
      className={base + border + ' transition-colors hover:bg-surface-container'}
    >
      {children}
    </Link>
  )
}
