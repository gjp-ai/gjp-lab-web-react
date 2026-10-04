import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { StateScreen } from './StateScreen'

describe('StateScreen', () => {
  it('adds one with the value and three with the updater function', async () => {
    const user = userEvent.setup()
    render(<StateScreen />)
    await user.click(screen.getByRole('button', { name: '+3 with value' }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '+3 with updater' }))
    expect(screen.getByText('Count: 4')).toBeInTheDocument()
  })

  it('replaces the object when a field changes', async () => {
    const user = userEvent.setup()
    render(<StateScreen />)
    const first = screen.getByRole('textbox', { name: 'First name' })
    await user.clear(first)
    await user.type(first, 'Ada')
    expect(screen.getByLabelText('Current state')).toHaveTextContent('{"first":"Ada","last":"Hopper"}')
  })

  it('bubbles a click to the card unless propagation is stopped', async () => {
    const user = userEvent.setup()
    render(<StateScreen />)
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(screen.getByRole('list', { name: 'Event log' })).toHaveTextContent('button handled the clickcard handled the click')

    await user.click(screen.getByRole('button', { name: 'Clear' }))
    await user.click(screen.getByRole('checkbox', { name: 'Stop propagation in the button' }))
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(screen.getByRole('list', { name: 'Event log' })).toHaveTextContent(/^button handled the click$/)
  })

  it('keeps Celsius and Fahrenheit in step through the parent', async () => {
    const user = userEvent.setup()
    render(<StateScreen />)
    const celsius = screen.getByRole('textbox', { name: 'Celsius' })
    await user.clear(celsius)
    await user.type(celsius, '100')
    expect(screen.getByRole('textbox', { name: 'Fahrenheit' })).toHaveValue('212')
    expect(screen.getByText('Water boils at this temperature.')).toBeInTheDocument()
  })
})
