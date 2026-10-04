import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ColorSchemeToggle } from './ColorSchemeToggle'
import { colorSchemeKey } from './colorScheme'

afterEach(() => {
  vi.unstubAllGlobals()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('ColorSchemeToggle', () => {
  it('starts from the system setting', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('dark'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    render(<ColorSchemeToggle />)
    expect(screen.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches the scheme, applies it to the page, and remembers it', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ColorSchemeToggle />)
    const toggle = screen.getByRole('button', { name: 'Dark mode' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(colorSchemeKey)).toBe('dark')

    // A new toggle (for example after the sidebar collapses) reads the saved choice.
    unmount()
    render(<ColorSchemeToggle />)
    await user.click(screen.getByRole('button', { name: 'Dark mode' }))
    expect(screen.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
