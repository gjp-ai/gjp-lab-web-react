import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ListsScreen } from './ListsScreen'

describe('ListsScreen', () => {
  it('keeps a note with its task only when the key is the id', async () => {
    const user = userEvent.setup()
    render(<ListsScreen />)
    const byIndex = screen.getByRole('list', { name: 'key={index}' })
    const byId = screen.getByRole('list', { name: 'key={task.id}' })
    await user.type(within(byIndex).getByRole('textbox', { name: 'Note for Write tests' }), 'first')
    await user.type(within(byId).getByRole('textbox', { name: 'Note for Write tests' }), 'first')

    await user.click(screen.getByRole('button', { name: 'Add to top' }))
    // The index-keyed list reused the first row's input for the new task.
    expect(within(byIndex).getByRole('textbox', { name: 'Note for New task 3' })).toHaveValue('first')
    expect(within(byIndex).getByRole('textbox', { name: 'Note for Write tests' })).toHaveValue('')
    expect(within(byId).getByRole('textbox', { name: 'Note for New task 3' })).toHaveValue('')
    expect(within(byId).getByRole('textbox', { name: 'Note for Write tests' })).toHaveValue('first')
  })

  it('filters and sorts the list while rendering', async () => {
    const user = userEvent.setup()
    render(<ListsScreen />)
    await user.type(screen.getByRole('searchbox', { name: 'Filter' }), 'swift')
    expect(within(screen.getByRole('list', { name: 'Languages' })).getAllByRole('listitem')).toHaveLength(1)

    await user.clear(screen.getByRole('searchbox', { name: 'Filter' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'name')
    expect(within(screen.getByRole('list', { name: 'Languages' })).getAllByRole('listitem')[0]).toHaveTextContent('C1972')

    await user.type(screen.getByRole('searchbox', { name: 'Filter' }), 'cobol')
    expect(screen.getByText('No languages match “cobol”.')).toBeInTheDocument()
  })
})
