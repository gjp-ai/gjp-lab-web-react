import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { navigationMenu } from '@/app/navigation/NavigationMenu'
import { HomeScreen } from './HomeScreen'

function renderHome() {
  return render(
    <MemoryRouter>
      <HomeScreen />
    </MemoryRouter>,
  )
}

describe('HomeScreen', () => {
  it('introduces the lab with counts taken from navigation.json', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 2, name: 'Learn the web platform by running it' })).toBeInTheDocument()
    const topics = navigationMenu.categories.flatMap((category) => category.topics)
    const available = topics.filter((topic) => topic.route !== undefined).length
    expect(screen.getByText('topics to try').nextSibling).toHaveTextContent(String(available))
    expect(screen.getByText('categories').nextSibling).toHaveTextContent(String(navigationMenu.categories.length))
  })

  it('links each featured topic and shows the address to share', () => {
    renderHome()
    const start = screen.getByRole('heading', { name: 'Start here' }).closest('section')!
    const links = within(start).getAllByRole('link')
    expect(links).toHaveLength(navigationMenu.featured.length)
    const fetch = within(start).getByRole('link', { name: /fetch/ })
    expect(fetch).toHaveAttribute('href', '/httpClient/fetch')
    // The shown address includes the deployment path (BASE_URL), so it works when pasted.
    expect(fetch).toHaveTextContent(`${import.meta.env.BASE_URL}httpClient/fetch`)
  })

  it('lists every category with links to its available topics and names the planned ones', () => {
    renderHome()
    for (const category of navigationMenu.categories) {
      expect(screen.getByRole('link', { name: new RegExp(`^${category.title}:`) })).toHaveAttribute('href', `/${category.id}`)
    }
    const react = screen.getByRole('list', { name: 'React topics' })
    expect(within(react).getByRole('link', { name: 'Effects' })).toHaveAttribute('href', '/react/reactEffects')
    expect(screen.getByText(/Also planned: Content Security Policy/)).toBeInTheDocument()
    expect(screen.getByText(/Coming soon: Firebase/)).toBeInTheDocument()
  })
})
