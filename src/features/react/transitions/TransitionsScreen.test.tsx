import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TransitionsScreen } from './TransitionsScreen'

function renderScreen() {
  return render(<TransitionsScreen latencyMs={0} slowItemMs={0} />)
}

describe('TransitionsScreen', () => {
  it('filters the list in a transition, and without one', async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.type(screen.getByRole('searchbox', { name: 'Filter packages' }), '29')
    expect(await screen.findByText('Showing results for “29”')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Packages' })).getAllByRole('listitem')).toHaveLength(13)

    await user.click(screen.getByRole('checkbox', { name: 'Filter in a transition' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filter packages' }), '9')
    expect(screen.getByText('Showing results for “299”')).toBeInTheDocument()
  })

  it('keeps the action result and the typed text after a failure', async () => {
    const user = userEvent.setup()
    renderScreen()
    const name = screen.getByRole('textbox', { name: 'Project name' })
    await user.clear(name)
    await user.type(name, 'ab')
    await user.click(screen.getByRole('button', { name: 'Rename' }))
    expect(await screen.findByText('A project name needs at least 3 characters.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveValue('ab')

    await user.type(screen.getByRole('textbox', { name: 'Project name' }), 'c lab')
    await user.click(screen.getByRole('button', { name: 'Rename' }))
    expect(await screen.findByText('abc lab', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.queryByText('A project name needs at least 3 characters.')).not.toBeInTheDocument()
  })

  it('keeps sent messages and rolls back failed ones', async () => {
    const user = userEvent.setup()
    renderScreen()
    const messages = screen.getByRole('list', { name: 'Messages' })
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await within(messages).findByText('Hello')).toBeInTheDocument()
    // React resets the form when the action finishes.
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue(''))

    // form.reset() bypasses user-event's record of the typed text, so clear the field explicitly.
    await user.clear(screen.getByRole('textbox', { name: 'Message' }))
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'this will fail')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('“this will fail” could not be sent.')).toBeInTheDocument()
    expect(within(messages).queryByText('this will fail')).not.toBeInTheDocument()
    expect(within(messages).getAllByRole('listitem')).toHaveLength(2)
  })
})
