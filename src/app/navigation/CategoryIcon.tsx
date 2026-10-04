import type { ReactNode } from 'react'
import type { CategoryIconName } from './NavigationMenu'

/** Simple stroked icons on a 24-unit grid, drawn inline so the shell needs no icon library. */
const icons: Record<CategoryIconName, ReactNode> = {
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />,
  react: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>
  ),
  shield: <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />,
  puzzle: (
    <path d="M5 8h3a2 2 0 1 1 4 0h3v3a2 2 0 1 1 0 4v3h-3a2 2 0 1 0-4 0H5v-3a2 2 0 1 0 0-4V8Z" />
  ),
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
}

/**
 * A category icon in a tinted tile: 44 px as on the iOS sidebar, or 28 px for the desktop tree.
 * Decorative: the row's text names it.
 */
export function CategoryIcon({ name, size = 'regular' }: { name: CategoryIconName; size?: 'regular' | 'small' }) {
  const tile = size === 'regular' ? 'size-11 rounded-xl' : 'size-7 rounded-md'
  return (
    <span className={'flex shrink-0 items-center justify-center bg-primary-container ' + tile} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        className={(size === 'regular' ? 'size-6' : 'size-4') + ' text-on-surface'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[name]}
      </svg>
    </span>
  )
}
