import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContentView } from './ContentView'

function renderAt(path: string, width: number) {
  window.innerWidth = width
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContentView />
    </MemoryRouter>,
  )
}

/** Reports a mouse as the primary pointer, as a desktop browser does. */
function withMouse() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('pointer: fine'),
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

afterEach(() => {
  window.innerWidth = 1024
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('ContentView', () => {
  it('shows one level at a time on a narrow window, with Back between levels', async () => {
    const user = userEvent.setup()
    renderAt('/', 400)
    expect(screen.getByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /^TypeScript:/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'TypeScript' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'GJP Lab' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Values & types/ }))
    expect(await screen.findByRole('heading', { level: 2, name: 'let and const' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Back' }))
    expect(screen.getByRole('heading', { level: 1, name: 'TypeScript' })).toBeInTheDocument()
  })

  it('shows the sidebar, catalogue, and feature side by side on a wide window', async () => {
    renderAt('/react/reactComponents', 1400)
    expect(screen.getByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'React' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: 'Components & props' })).toBeInTheDocument()
    // The selected category and topic are marked for assistive technology as well as visually.
    expect(screen.getByRole('link', { name: /^React:/ })).toHaveAttribute('aria-current', 'page')
  })

  it('opens on the home page in every layout', () => {
    renderAt('/', 400)
    expect(screen.getByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Start here' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument()
  })

  it('shows the home page beside the sidebar on wide windows', () => {
    renderAt('/', 1400)
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByText('Choose a category')).not.toBeInTheDocument()

    withMouse()
    renderAt('/', 1400)
    expect(screen.getAllByRole('heading', { level: 1, name: 'Home' })).toHaveLength(2)
  })

  it('prompts for a topic before one is chosen on a medium window', () => {
    renderAt('/others', 1000)
    expect(screen.getByRole('heading', { level: 1, name: 'Others' })).toBeInTheDocument()
    expect(screen.getByText('Choose a topic')).toBeInTheDocument()
  })

  it('shows available topics as links and planned topics without one', () => {
    renderAt('/httpClient', 400)
    expect(screen.getByRole('link', { name: /fetch/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /axios/ })).toBeInTheDocument()

    renderAt('/security', 400)
    expect(screen.getByRole('link', { name: /Hide content when the page is hidden/ })).toHaveAttribute('href', '/security/hideContent')
    expect(screen.queryByRole('link', { name: /Content Security Policy/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Planned' })).toHaveLength(2)
  })

  it('falls back to the nearest valid level for an unknown URL', () => {
    renderAt('/typescript/notATopic', 400)
    expect(screen.getByRole('heading', { level: 1, name: 'TypeScript' })).toBeInTheDocument()
  })

  it('opens the topic for a deeper URL, such as an old response link', async () => {
    renderAt('/httpClient/fetch/response', 400)
    expect(await screen.findByRole('heading', { level: 1, name: 'fetch' })).toBeInTheDocument()
  })

  it('shows a tree sidebar next to the feature on a desktop window', async () => {
    withMouse()
    const user = userEvent.setup()
    renderAt('/typescript/typescriptBasics', 1400)
    expect(await screen.findByRole('heading', { level: 1, name: 'Values & types' })).toBeInTheDocument()
    // The catalogue pane is not shown: the selected category is open in the tree instead.
    expect(screen.queryByRole('heading', { level: 1, name: 'TypeScript' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'TypeScript' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Values & types' })).toHaveAttribute('aria-current', 'page')

    const react = screen.getByRole('button', { name: 'React' })
    expect(react).toHaveAttribute('aria-expanded', 'false')
    await user.click(react)
    expect(react).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('State & events')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Components & props' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Components & props' })).toBeInTheDocument()
  })

  it('shows the catalogue in the content pane when only a category is chosen on a desktop window', () => {
    withMouse()
    renderAt('/others', 1000)
    expect(screen.getByRole('heading', { level: 1, name: 'Others' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Others' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses the desktop sidebar to a rail of icons and remembers the choice', async () => {
    withMouse()
    const user = userEvent.setup()
    const { unmount } = renderAt('/typescript/typescriptBasics', 1400)

    await user.click(screen.getByRole('button', { name: 'Hide sidebar' }))
    expect(screen.queryByRole('heading', { level: 1, name: 'GJP Lab' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show sidebar' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Show TypeScript topics' })).toHaveAttribute('aria-current', 'true')

    // The choice survives a reload.
    unmount()
    renderAt('/typescript/typescriptBasics', 1400)
    expect(screen.getByRole('navigation', { name: 'Categories' })).toBeInTheDocument()

    // A rail icon opens the sidebar with that category's topics showing.
    await user.click(screen.getByRole('button', { name: 'Show React topics' }))
    expect(screen.getByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Hide sidebar' })).toHaveFocus()
  })

  it('toggles the desktop sidebar with the [ key, but not while typing', async () => {
    withMouse()
    const user = userEvent.setup()
    renderAt('/httpClient/fetch', 1400)
    const url = await screen.findByRole('textbox', { name: /url/i })

    // user-event writes a literal [ as [[.
    await user.type(url, '[[')
    expect(screen.getByRole('button', { name: 'Hide sidebar' })).toBeInTheDocument()

    await user.click(document.body)
    await user.keyboard('[[')
    expect(screen.getByRole('button', { name: 'Show sidebar' })).toBeInTheDocument()
    await user.keyboard('[[')
    expect(screen.getByRole('button', { name: 'Hide sidebar' })).toBeInTheDocument()
  })
})
