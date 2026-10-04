import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { CodeSample } from './CodeSample'
import { CodeSampleCard } from './CodeSampleCard'

const sample: CodeSample = {
  title: 'Hello',
  explanation: 'A sample logs lines instead of printing them.',
  code: "log('Hello, TypeScript!')",
  run: (log) => log('Hello, TypeScript!'),
}

describe('CodeSampleCard', () => {
  it('shows the code, then the output after Run, replacing it on the next run', async () => {
    const user = userEvent.setup()
    render(<CodeSampleCard sample={sample} />)
    expect(screen.getByText("log('Hello, TypeScript!')")).toBeInTheDocument()
    expect(screen.getByText('Tap Run to see the output')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Run' }))
    expect(await screen.findByTestId('codeSample.output')).toHaveTextContent('Hello, TypeScript!')

    await user.click(screen.getByRole('button', { name: 'Run' }))
    expect(await screen.findByTestId('codeSample.output')).toHaveTextContent(/^Hello, TypeScript!$/)
  })
})
