import type { ReactNode } from 'react'

/**
 * A scrolling demo page: a short introduction followed by `LabDemoSection` cards. The pane supplies the
 * title and limits the width. Used by the React topics, where each card shows one technique.
 */
export function LabDemoPage({ intro, children }: { intro: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[18px] px-5 pb-8">
      <p className="pt-1 text-on-surface-variant">{intro}</p>
      {children}
    </div>
  )
}

/** A titled card that groups one demo: a heading, a one-line explanation, then the live sample. */
export function LabDemoSection({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3.5 rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-1">
        {/* A real heading, so screen-reader users can jump between demos. */}
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-on-surface-variant">{caption}</p>
      </div>
      {children}
    </section>
  )
}
