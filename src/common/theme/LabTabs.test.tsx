import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LabTabs } from './LabTabs'

const tabs = [
  { id: 'one', label: 'One', content: <p>First panel</p> },
  { id: 'two', label: 'Two', content: <p>Second panel</p> },
  { id: 'three', label: 'Three', content: <p>Third panel</p> },
]

describe('LabTabs', () => {
  it('shows the panel of the clicked tab', async () => {
    const user = userEvent.setup()
    render(<LabTabs label="Numbers" tabs={tabs} />)
    expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveTextContent('First panel')
    await user.click(screen.getByRole('tab', { name: 'Two' }))
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Two' })).toHaveTextContent('Second panel')
  })

  it('moves between tabs with the arrow keys, Home, and End', async () => {
    const user = userEvent.setup()
    render(<LabTabs label="Numbers" tabs={tabs} />)
    await user.tab()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{End}{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
    // Only the selected tab is in the Tab order; the next Tab goes to the panel.
    await user.tab()
    expect(screen.getByRole('tabpanel')).toHaveFocus()
  })
})
