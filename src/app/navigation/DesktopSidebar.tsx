import { useEffect, useRef, useState, type Ref } from 'react'
import { ColorSchemeToggle } from '@/common/theme/ColorSchemeToggle'
import { CategoryIcon } from './CategoryIcon'
import type { FeatureRoute } from './FeatureRoute'
import type { NavigationCategory } from './NavigationMenu'
import { NavigationPane } from './NavigationPane'
import { NavigationTree } from './NavigationTree'
import { isSidebarShortcut, useSidebarCollapsed } from './sidebarPreference'

/**
 * The desktop sidebar: the navigation tree, or a narrow rail of category icons when collapsed. The
 * header button and the `[` key switch between them, and the choice is remembered in this browser.
 * Clicking a rail icon opens the sidebar with that category's topics showing.
 */
export function DesktopSidebar({
  categories,
  selectedCategoryId,
  selectedRoute,
}: {
  categories: NavigationCategory[]
  selectedCategoryId?: string
  selectedRoute?: FeatureRoute
}) {
  const [isCollapsed, setIsCollapsed] = useSidebarCollapsed()
  const [openCategoryId, setOpenCategoryId] = useState<string>()
  const toggleRef = useRef<HTMLButtonElement>(null)
  // The toggle button is replaced when the state changes; move focus to the new one only after a user action.
  const shouldFocusToggle = useRef(false)

  const changeCollapsed = (next: boolean) => {
    shouldFocusToggle.current = true
    setIsCollapsed(next)
  }

  useEffect(() => {
    if (!shouldFocusToggle.current) return
    shouldFocusToggle.current = false
    toggleRef.current?.focus()
  }, [isCollapsed])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSidebarShortcut(event)) return
      event.preventDefault()
      changeCollapsed(!isCollapsed)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  if (isCollapsed) {
    return (
      <nav aria-label="Categories" className="flex h-full w-14 shrink-0 flex-col items-center bg-background">
        <div className="flex min-h-16 items-center">
          <SidebarToggle ref={toggleRef} label="Show sidebar" onClick={() => changeCollapsed(false)} />
        </div>
        <ul className="flex flex-col gap-1.5">
          {categories.map((category) => {
            const isSelected = category.id === selectedCategoryId
            return (
              <li key={category.id}>
                <button
                  type="button"
                  aria-label={`Show ${category.title} topics`}
                  aria-current={isSelected ? 'true' : undefined}
                  title={category.title}
                  onClick={() => {
                    setOpenCategoryId(category.id)
                    changeCollapsed(false)
                  }}
                  className={
                    'flex size-10 items-center justify-center rounded-lg hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary ' +
                    (isSelected ? 'border border-primary' : 'border border-transparent')
                  }
                >
                  <CategoryIcon name={category.icon} size="small" />
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-auto pb-3">
          <ColorSchemeToggle />
        </div>
      </nav>
    )
  }

  return (
    <NavigationPane
      title="GJP Lab"
      className="w-72 shrink-0"
      headerAction={
        <>
          <ColorSchemeToggle />
          <SidebarToggle ref={toggleRef} label="Hide sidebar" onClick={() => changeCollapsed(true)} />
        </>
      }
    >
      <NavigationTree
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        selectedRoute={selectedRoute}
        openCategoryId={openCategoryId}
      />
    </NavigationPane>
  )
}

function SidebarToggle({ ref, label, onClick }: { ref: Ref<HTMLButtonElement>; label: string; onClick: () => void }) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-keyshortcuts="["
      title={`${label} ([)`}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
      </svg>
    </button>
  )
}
