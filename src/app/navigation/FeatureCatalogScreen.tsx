import { LabListCard } from '@/common/theme/LabListCard'
import type { FeatureRoute } from './FeatureRoute'
import type { NavigationCategory, NavigationTopic } from './NavigationMenu'

/**
 * The second pane: the category description, then one card per topic. Available topics end with a
 * chevron and link to their feature; planned topics end with a clock and cannot be opened.
 */
export function FeatureCatalogScreen({
  category,
  selectedRoute,
}: {
  category: NavigationCategory
  selectedRoute?: FeatureRoute
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-1.5">
      <p className="px-1 pt-1 text-sm text-on-surface-variant">{category.description}</p>
      <ul className="flex flex-col gap-3">
        {category.topics.map((topic) => (
          <li key={topic.title}>
            <LabListCard
              to={topic.route === undefined ? undefined : `/${category.id}/${topic.route}`}
              isSelected={topic.route !== undefined && topic.route === selectedRoute}
            >
              <CatalogRow topic={topic} />
            </LabListCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CatalogRow({ topic }: { topic: NavigationTopic }) {
  const isAvailable = topic.route !== undefined
  return (
    <>
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="font-semibold">{topic.title}</span>
        <span className="text-sm text-on-surface-variant">{topic.description}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        className={'size-5 shrink-0 ' + (isAvailable ? 'text-on-surface' : 'text-on-surface-variant')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={isAvailable ? 'Open' : 'Planned'}
      >
        {isAvailable ? <path d="m9 6 6 6-6 6" /> : <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
      </svg>
    </>
  )
}
