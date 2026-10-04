import { LabListCard } from '@/common/theme/LabListCard'
import { CategoryIcon } from './CategoryIcon'
import type { NavigationCategory } from './NavigationMenu'

/** The first pane: every category as a card with its icon, title, and summary. */
export function CategorySidebar({
  categories,
  selectedCategoryId,
}: {
  categories: NavigationCategory[]
  selectedCategoryId?: string
}) {
  return (
    <ul className="flex flex-col gap-3 px-4 py-1.5">
      {categories.map((category) => (
        <li key={category.id}>
          <LabListCard
            to={`/${category.id}`}
            isSelected={category.id === selectedCategoryId}
            label={`${category.title}: ${category.summary}. Opens the ${category.title} catalogue`}
          >
            <CategoryIcon name={category.icon} />
            <span className="flex flex-col gap-1.5">
              <span className="font-semibold">{category.title}</span>
              <span className="text-sm text-on-surface-variant">{category.summary}</span>
            </span>
          </LabListCard>
        </li>
      ))}
    </ul>
  )
}
