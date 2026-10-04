import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RefsScreen } from './RefsScreen'

afterEach(() => {
  vi.restoreAllMocks()
  delete (Element.prototype as Partial<Element>).scrollIntoView
})

describe('RefsScreen', () => {
  it('focuses and selects the input through a ref passed as a prop', async () => {
    const user = userEvent.setup()
    render(<RefsScreen />)
    const field = screen.getByRole('searchbox', { name: 'Search the docs' })
    await user.click(screen.getByRole('button', { name: 'Focus the field' }))
    expect(field).toHaveFocus()
  })

  it('starts and stops the stopwatch', async () => {
    const user = userEvent.setup()
    render(<RefsScreen />)
    expect(screen.getByText('0.00 s')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()
  })

  it('measures the box element', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 320.4, 72))
    render(<RefsScreen />)
    await user.click(screen.getByRole('button', { name: 'Measure' }))
    expect(screen.getByText('Measured: 320 × 72 px')).toBeInTheDocument()
  })

  it('scrolls the chosen row into view', async () => {
    const user = userEvent.setup()
    // jsdom does not lay out pages, so it has no scrollIntoView; record the call instead.
    const scrolled: string[] = []
    Element.prototype.scrollIntoView = function (this: Element) {
      scrolled.push(this.textContent ?? '')
    }
    render(<RefsScreen />)
    const row = screen.getByRole('spinbutton', { name: 'Row (1–40)' })
    await user.clear(row)
    await user.type(row, '33')
    await user.click(screen.getByRole('button', { name: 'Scroll to row' }))
    expect(scrolled).toEqual(['Row 33'])
  })
})
