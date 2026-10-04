import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AccessibilityScreen } from './AccessibilityScreen'

describe('AccessibilityScreen', () => {
  it('reaches the real button with the keyboard, but not the div', async () => {
    const user = userEvent.setup()
    render(<AccessibilityScreen />)
    // Only one "Save" has the button role: the <div> is invisible to getByRole.
    const save = screen.getByRole('button', { name: 'Save' })
    await user.tab()
    expect(save).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Pressed 1 times')).toBeInTheDocument()
  })

  it('opens an answer and reports it with aria-expanded', async () => {
    const user = userEvent.setup()
    render(<AccessibilityScreen />)
    const question = screen.getByRole('button', { name: 'What does aria-expanded add?' })
    expect(question).toHaveAttribute('aria-expanded', 'false')
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/^It tells assistive technology/)).toBeVisible()
  })

  it('announces a change in the status region', async () => {
    const user = userEvent.setup()
    render(<AccessibilityScreen />)
    await user.click(screen.getByRole('button', { name: 'Add to basket' }))
    expect(screen.getByRole('status')).toHaveTextContent('Added to basket. 1 item in total.')
  })
})
