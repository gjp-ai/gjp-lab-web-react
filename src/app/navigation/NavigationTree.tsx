import { useState } from 'react'
import { Link } from 'react-router'
import { CategoryIcon } from './CategoryIcon'
import type { FeatureRoute } from './FeatureRoute'
import type { NavigationCategory } from './NavigationMenu'

/**
 * The desktop sidebar: every category as a group that opens and closes, with its topics as compact
 * links underneath. The selected category opens on its own, so the selected topic is always visible;
 * `openCategoryId` also opens a category when the tree first appears (a rail icon of the collapsed sidebar).
 */
export function NavigationTree({
  categories,
  selectedCategoryId,
  selectedRoute,
  openCategoryId,
}: {
  categories: NavigationCategory[]
  selectedCategoryId?: string
  selectedRoute?: FeatureRoute
  openCategoryId?: string
}) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set([selectedCategoryId, openCategoryId].filter((id) => id !== undefined)),
  )
  // Open a newly selected category (for example after Back or a pasted link) while rendering, not in an effect.
  const [openedFor, setOpenedFor] = useState(selectedCategoryId)
  if (selectedCategoryId !== openedFor) {
    setOpenedFor(selectedCategoryId)
    if (selectedCategoryId !== undefined) setExpandedIds((ids) => new Set(ids).add(selectedCategoryId))
  }

  const toggle = (id: string) =>
    setExpandedIds((ids) => {
      const next = new Set(ids)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <ul className="flex flex-col gap-1 px-3 pb-4">
      {categories.map((category) => {
        const isExpanded = expandedIds.has(category.id)
        const groupId = `navigation-tree-${category.id}`
        return (
          <li key={category.id}>
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={groupId}
              onClick={() => toggle(category.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Chevron isExpanded={isExpanded} />
              <CategoryIcon name={category.icon} size="small" />
              {category.title}
            </button>
            {isExpanded && (
              <ul id={groupId} aria-label={category.title} className="mt-0.5 mb-2 flex flex-col gap-0.5 pl-9">
                {category.topics.map((topic) => (
                  <li key={topic.title}>
                    {topic.route === undefined ? (
                      <span className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-on-surface-variant">
                        {topic.title}
                        <span className="text-xs">Planned</span>
                      </span>
                    ) : (
                      <TopicLink
                        to={`/${category.id}/${topic.route}`}
                        title={topic.title}
                        description={topic.description}
                        isSelected={topic.route === selectedRoute}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function TopicLink({ to, title, description, isSelected }: { to: string; title: string; description: string; isSelected: boolean }) {
  // The selected topic gets a primary bar and bold text, so it differs from the hover background.
  const state = isSelected ? 'border-primary bg-surface-container font-semibold' : 'border-transparent hover:bg-surface-container'
  return (
    <Link
      to={to}
      title={description}
      aria-current={isSelected ? 'page' : undefined}
      className={'block rounded-r-lg border-l-2 px-3 py-1.5 text-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary ' + state}
    >
      {title}
    </Link>
  )
}

function Chevron({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={'size-4 shrink-0 text-on-surface-variant transition-transform motion-reduce:transition-none ' + (isExpanded ? 'rotate-90' : '')}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
