import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SuspenseScreen } from './SuspenseScreen'

/**
 * use() suspends while rendering, so React needs the render, and any click that sets a new promise,
 * inside an awaited act() to wait for the promise.
 */
async function renderScreen() {
  await act(async () => {
    render(<SuspenseScreen latencyMs={0} />)
  })
}

function section(title: string) {
  return screen.getByRole('heading', { name: title }).closest('section')!
}

describe('SuspenseScreen', () => {
  it('loads the lazy component behind a fallback', async () => {
    const user = userEvent.setup()
    await renderScreen()
    await user.click(screen.getByRole('button', { name: 'Show timeline' }))
    expect(await screen.findByRole('list', { name: 'React major releases' })).toHaveTextContent('192024')
  })

  it('shows the data once the promise resolves, and again when it changes', async () => {
    const user = userEvent.setup()
    await renderScreen()
    const data = section('Waiting for data with use()')
    expect(await within(data).findByText('December 2024', { exact: false })).toBeInTheDocument()

    await act(() => user.click(within(data).getByRole('button', { name: 'React 18' })))
    expect(await within(data).findByText('March 2022', { exact: false })).toBeInTheDocument()
  })

  it('keeps the old notes during a transition', async () => {
    const user = userEvent.setup()
    await renderScreen()
    const transition = section('Keep showing the old content')
    expect(await within(transition).findByText('March 2022', { exact: false })).toBeInTheDocument()

    await act(() => user.click(within(transition).getByRole('button', { name: 'React 19' })))
    expect(within(transition).queryByText('Loading release notes…')).not.toBeInTheDocument()
    expect(await within(transition).findByText('December 2024', { exact: false })).toBeInTheDocument()
  })
})
