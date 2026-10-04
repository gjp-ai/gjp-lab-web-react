import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ComponentsScreen } from './ComponentsScreen'

describe('ComponentsScreen', () => {
  it('passes the typed name to both greetings as a prop', async () => {
    const user = userEvent.setup()
    render(<ComponentsScreen />)
    const name = screen.getByRole('textbox', { name: 'Name' })
    await user.clear(name)
    expect(screen.getAllByText('stranger')).toHaveLength(2)
    await user.type(name, 'Lin')
    expect(screen.getAllByText('Lin')).toHaveLength(2)
  })

  it('switches the callout tone', async () => {
    const user = userEvent.setup()
    render(<ComponentsScreen />)
    await user.click(screen.getByRole('button', { name: 'Use strong tone' }))
    expect(screen.getByRole('button', { name: 'Use plain tone' })).toBeInTheDocument()
  })

  it('hides the badge and the button when everything is read', async () => {
    const user = userEvent.setup()
    render(<ComponentsScreen />)
    expect(screen.getByLabelText('3 unread')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark all read' }))
    expect(screen.queryByLabelText(/unread/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark all read' })).not.toBeInTheDocument()
    expect(screen.getByText('All caught up.')).toBeInTheDocument()
  })
})
