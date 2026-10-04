import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { ContentView } from './ContentView'

function renderAt(path: string, width: number) {
  window.innerWidth = width
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContentView />
    </MemoryRouter>,
  )
}

afterEach(() => {
  window.innerWidth = 1024
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

  it('prompts for a topic before one is chosen on a medium window', () => {
    renderAt('/others', 1000)
    expect(screen.getByRole('heading', { level: 1, name: 'Others' })).toBeInTheDocument()
    expect(screen.getByText('Choose a topic')).toBeInTheDocument()
  })

  it('shows planned topics without a link', () => {
    renderAt('/httpClient', 400)
    expect(screen.getByRole('link', { name: /fetch/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /axios/ })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Planned' })).toBeInTheDocument()
  })

  it('falls back to the nearest valid level for an unknown URL', () => {
    renderAt('/typescript/notATopic', 400)
    expect(screen.getByRole('heading', { level: 1, name: 'TypeScript' })).toBeInTheDocument()
  })

  it('returns to the feature when a pushed screen has no data (for example after a reload)', async () => {
    renderAt('/httpClient/fetch/response', 400)
    expect(await screen.findByRole('heading', { level: 1, name: 'fetch' })).toBeInTheDocument()
  })
})
