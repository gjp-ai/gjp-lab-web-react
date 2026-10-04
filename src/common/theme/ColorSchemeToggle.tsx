import { useColorScheme } from './colorScheme'

/**
 * An icon button that switches between light and dark mode. It is a toggle named "Dark mode", so
 * assistive technology announces it as pressed or not pressed; the icon shows the current mode.
 */
export function ColorSchemeToggle() {
  const [scheme, toggle] = useColorScheme()
  const isDark = scheme === 'dark'
  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className="flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isDark ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  )
}
