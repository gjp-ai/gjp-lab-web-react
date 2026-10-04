import { describe, expect, it } from 'vitest'
import { featureRoutes } from './FeatureRoute'
import { findCategory, findTopic, navigationMenu, parseNavigationMenu } from './NavigationMenu'

describe('navigation.json', () => {
  it('decodes with unique category ids and topic titles', () => {
    const ids = navigationMenu.categories.map((category) => category.id)
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
    for (const category of navigationMenu.categories) {
      const titles = category.topics.map((topic) => topic.title)
      expect(new Set(titles).size, `${category.id} repeats a topic title`).toBe(titles.length)
    }
  })

  it('lists every FeatureRoute exactly once', () => {
    const routes = navigationMenu.categories.flatMap((category) => category.topics).flatMap((topic) => (topic.route ? [topic.route] : []))
    expect([...routes].sort()).toEqual([...featureRoutes].sort())
  })

  it('rejects an unknown route instead of hiding the topic', () => {
    const json = {
      categories: [{ id: 'x', title: 'X', summary: '', description: '', icon: 'code', topics: [{ title: 'T', description: '', route: 'missing' }] }],
    }
    expect(() => parseNavigationMenu(json)).toThrow('unknown route "missing"')
  })

  it('rejects an unknown icon', () => {
    const json = { categories: [{ id: 'x', title: 'X', summary: '', description: '', icon: 'rocket', topics: [] }] }
    expect(() => parseNavigationMenu(json)).toThrow('unknown icon "rocket"')
  })

  it('finds categories by id and topics by route', () => {
    expect(findCategory('httpClient')?.title).toBe('HTTP Client')
    expect(findCategory('missing')).toBeUndefined()
    for (const route of featureRoutes) expect(findTopic(route)?.route).toBe(route)
  })

  it('puts TypeScript first, like Swift on iOS', () => {
    expect(navigationMenu.categories[0].id).toBe('typescript')
  })
})
