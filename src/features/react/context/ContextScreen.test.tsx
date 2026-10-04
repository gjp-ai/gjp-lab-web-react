import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContextScreen } from './ContextScreen'

describe('ContextScreen', () => {
  it('passes the units to deep components through the provider', async () => {
    const user = userEvent.setup()
    render(<ContextScreen />)
    expect(screen.getByText('42.2 km')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Use miles' }))
    expect(screen.getByText('26.2 mi')).toBeInTheDocument()
  })

  it('uses the nearest provider, or the default without one', () => {
    render(<ContextScreen />)
    const section = screen.getByRole('heading', { name: 'The nearest provider wins' }).closest('section')!
    expect(within(section).getByText('No provider (default)').nextSibling).toHaveTextContent('10.0 km')
    expect(within(section).getByText('Inside an imperial provider').nextSibling).toHaveTextContent('6.2 mi')
    expect(within(section).getByText('Inside a metric provider, inside the imperial one').nextSibling).toHaveTextContent('10.0 km')
  })

  it('shares cart state between distant components', async () => {
    const user = userEvent.setup()
    render(<ContextScreen />)
    expect(screen.getByRole('button', { name: 'Empty cart' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Add Notebook to cart' }))
    await user.click(screen.getByRole('button', { name: 'Add Pencil to cart' }))
    expect(screen.getByText('Cart: 2 items')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Empty cart' }))
    expect(screen.getByText('Cart: 0 items')).toBeInTheDocument()
  })
})
