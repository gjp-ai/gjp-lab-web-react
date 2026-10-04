import { type FeatureRoute, isFeatureRoute } from './FeatureRoute'
import navigationJson from './navigation.json'

/** The icon names navigation.json may use; `CategoryIcon` draws each one. */
export const categoryIcons = ['code', 'react', 'network', 'shield', 'puzzle', 'sliders'] as const
export type CategoryIconName = (typeof categoryIcons)[number]

/** A catalogue row; a topic without a route is planned and cannot be opened. */
export interface NavigationTopic {
  title: string
  description: string
  route?: FeatureRoute
}

/** A sidebar row and the catalogue it opens. */
export interface NavigationCategory {
  id: string
  title: string
  /** Shown under the title in the sidebar. */
  summary: string
  /** Shown above the topic list in the catalogue. */
  description: string
  icon: CategoryIconName
  topics: NavigationTopic[]
}

export interface NavigationMenu {
  categories: NavigationCategory[]
}

/**
 * Checks raw JSON and returns a typed menu. An unknown route or icon is a programming error, so it throws
 * with a clear message instead of hiding a topic; unit tests run this on the bundled file.
 */
export function parseNavigationMenu(raw: unknown): NavigationMenu {
  const fail = (message: string): never => {
    throw new Error(`Invalid navigation.json: ${message}`)
  }
  if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { categories?: unknown }).categories)) {
    fail('expected { "categories": [...] }')
  }
  const categories = (raw as { categories: unknown[] }).categories.map((value, index): NavigationCategory => {
    const category = value as Record<string, unknown>
    for (const key of ['id', 'title', 'summary', 'description', 'icon'] as const) {
      if (typeof category[key] !== 'string') fail(`category ${index} is missing "${key}"`)
    }
    if (!(categoryIcons as readonly string[]).includes(category.icon as string)) {
      fail(`unknown icon "${String(category.icon)}" in "${String(category.id)}"`)
    }
    if (!Array.isArray(category.topics)) fail(`category "${String(category.id)}" has no topics`)
    const topics = (category.topics as Record<string, unknown>[]).map((topic): NavigationTopic => {
      if (typeof topic.title !== 'string' || typeof topic.description !== 'string') {
        fail(`a topic in "${String(category.id)}" is missing its title or description`)
      }
      if (topic.route !== undefined && (typeof topic.route !== 'string' || !isFeatureRoute(topic.route))) {
        fail(`unknown route "${String(topic.route)}" in "${String(topic.title)}"`)
      }
      return {
        title: topic.title as string,
        description: topic.description as string,
        route: topic.route as FeatureRoute | undefined,
      }
    })
    return {
      id: category.id as string,
      title: category.title as string,
      summary: category.summary as string,
      description: category.description as string,
      icon: category.icon as CategoryIconName,
      topics,
    }
  })
  return { categories }
}

/** The app's menu, read once from the bundled navigation.json. */
export const navigationMenu: NavigationMenu = parseNavigationMenu(navigationJson)

export function findCategory(id: string | undefined): NavigationCategory | undefined {
  return navigationMenu.categories.find((category) => category.id === id)
}

/** The topic that carries `route`, used for the feature pane's title. */
export function findTopic(route: FeatureRoute): NavigationTopic | undefined {
  return navigationMenu.categories.flatMap((category) => category.topics).find((topic) => topic.route === route)
}
