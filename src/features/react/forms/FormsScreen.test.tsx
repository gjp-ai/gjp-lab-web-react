import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FormsScreen } from './FormsScreen'

describe('FormsScreen', () => {
  it('renders the summary from the controlled inputs', async () => {
    const user = userEvent.setup()
    render(<FormsScreen latencyMs={0} />)
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Lin')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Plan' }), 'enterprise')
    await user.click(screen.getByRole('radio', { name: 'L' }))
    await user.click(screen.getByRole('checkbox', { name: 'Email me product news' }))
    expect(screen.getByLabelText('Form state')).toHaveTextContent('nameLinplanenterprisesizeLnewsfalse')
  })

  it('shows linked errors, focuses the first one, and accepts valid values', async () => {
    const user = userEvent.setup()
    render(<FormsScreen latencyMs={0} />)
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    const email = screen.getByLabelText('Email')
    expect(email).toHaveFocus()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Enter your email address.')

    await user.type(email, 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'engine42')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(screen.getByText('Account created for ada@example.com.')).toBeInTheDocument()
  })

  it('sends the form data through a form action', async () => {
    const user = userEvent.setup()
    render(<FormsScreen latencyMs={0} />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Topic' }), 'Bug')
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'The ticker stops.')
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    expect(await screen.findByText(/^Bug received as ticket FB-\d{4}\.$/)).toBeInTheDocument()
    // React resets uncontrolled fields after the action.
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('')

    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    expect(await screen.findByText('Write a message before sending.')).toBeInTheDocument()
  })
})
