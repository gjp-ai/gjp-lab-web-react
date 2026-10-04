import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { EffectsScreen } from './EffectsScreen'

describe('EffectsScreen', () => {
  it('runs setup when the ticker appears and cleanup when it goes', async () => {
    const user = userEvent.setup()
    render(<EffectsScreen searchDelayMs={0} />)
    await user.click(screen.getByRole('button', { name: 'Show ticker' }))
    expect(screen.getByText(/Ticker has run for 0 s/)).toBeInTheDocument()
    expect(screen.getByText('setup: interval started')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove ticker' }))
    expect(screen.queryByText(/Ticker has run/)).not.toBeInTheDocument()
    expect(screen.getByText('cleanup: interval cleared')).toBeInTheDocument()
  })

  it('searches again when the query changes', async () => {
    const user = userEvent.setup()
    render(<EffectsScreen searchDelayMs={0} />)
    await user.type(screen.getByRole('searchbox', { name: 'Search fruit' }), 'berry')
    expect(await screen.findByText('1 found: Blueberry')).toBeInTheDocument()
    expect(screen.getByText('searched for "berry"')).toBeInTheDocument()
  })

  it('calculates derived values while rendering', async () => {
    const user = userEvent.setup()
    render(<EffectsScreen searchDelayMs={0} />)
    expect(screen.getByText('KJ')).toBeInTheDocument()
    const first = screen.getByRole('textbox', { name: 'First name' })
    await user.clear(first)
    await user.type(first, 'mary')
    expect(screen.getByText('MJ')).toBeInTheDocument()
  })
})
