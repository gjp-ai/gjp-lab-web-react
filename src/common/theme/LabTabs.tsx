import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface LabTab {
  id: string
  label: ReactNode
  content: ReactNode
}

/**
 * Tabs that follow the WAI-ARIA tabs pattern: a `tablist` of buttons, one `tabpanel`, the arrow keys
 * (and Home and End) move between tabs, and only the selected tab is in the Tab order.
 */
export function LabTabs({ label, tabs }: { label: string; tabs: LabTab[] }) {
  const [selectedId, setSelectedId] = useState(tabs[0]?.id)
  const baseId = useId()
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const selected = tabs.find((tab) => tab.id === selectedId) ?? tabs[0]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === selected.id)
    const next =
      event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : undefined
    if (next === undefined) return
    event.preventDefault()
    setSelectedId(tabs[next].id)
    buttons.current.get(tabs[next].id)?.focus()
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-1 border-b border-outline-variant">
        {tabs.map((tab) => {
          const isSelected = tab.id === selected.id
          return (
            <button
              key={tab.id}
              ref={(element) => {
                if (element !== null) buttons.current.set(tab.id, element)
                return () => {
                  buttons.current.delete(tab.id)
                }
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(tab.id)}
              className={
                '-mb-px flex min-h-10 items-center gap-1.5 border-b-2 px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ' +
                (isSelected ? 'border-primary text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface')
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected.id}`} tabIndex={0} className="min-w-0 focus-visible:outline-2 focus-visible:outline-primary">
        {selected.content}
      </div>
    </div>
  )
}
