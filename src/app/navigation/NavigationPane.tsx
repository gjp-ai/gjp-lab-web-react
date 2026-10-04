import type { ReactNode } from 'react'
import { Link } from 'react-router'

/**
 * One navigation pane: a header with the title and an optional back link, above content limited to
 * 720 px and centred. Each pane scrolls on its own.
 */
export function NavigationPane({
  title,
  backTo,
  className = '',
  children,
}: {
  title: string
  /** The parent URL; shown as a back arrow when the parent pane is not visible. */
  backTo?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section aria-label={title} className={'flex h-full min-w-0 flex-col bg-background ' + className}>
      <header className="flex min-h-16 items-center gap-1 px-2">
        {backTo !== undefined && (
          <Link
            to={backTo}
            aria-label="Back"
            className="flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
            </svg>
          </Link>
        )}
        <h1 className={'truncate text-[22px] ' + (backTo === undefined ? 'pl-3' : '')}>{title}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px]">{children}</div>
      </div>
    </section>
  )
}

/** Shown in an empty pane before a selection, for example "Choose a topic". */
export function NavigationPlaceholder({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={'flex h-full items-center justify-center bg-background text-lg text-on-surface-variant ' + className}>
      {text}
    </div>
  )
}
