import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ClipboardEnvironment } from './clipboardRepository'
import { ClipboardScreen } from './ClipboardScreen'

class FakePermissionStatus extends EventTarget {
  name: PermissionName = 'geolocation'
  onchange = null
  state: PermissionState
  constructor(state: PermissionState) {
    super()
    this.state = state
  }
}

/** A clipboard that remembers what was written, and permissions that report fixed states. */
function fakeEnvironment(contents = '') {
  let text = contents
  const writeText = vi.fn(async (value: string) => {
    text = value
  })
  const environment: ClipboardEnvironment = {
    clipboard: { writeText, readText: async () => text },
    permissions: { query: async ({ name }) => new FakePermissionStatus((name as string) === 'clipboard-read' ? 'prompt' : 'granted') },
    isSecureContext: true,
  }
  return { environment, writeText }
}

describe('ClipboardScreen', () => {
  it('copies the text in the field', async () => {
    const user = userEvent.setup()
    const { environment, writeText } = fakeEnvironment()
    render(<ClipboardScreen environment={environment} />)
    await user.click(screen.getByRole('button', { name: 'Copy' }))
    expect(writeText).toHaveBeenCalledWith('Hello from GJP Lab')
    expect(await screen.findByText('Copied. Paste it anywhere to check.')).toBeInTheDocument()
  })

  it('copies the code and clears the clipboard when the time is up', async () => {
    const user = userEvent.setup()
    const { environment, writeText } = fakeEnvironment()
    render(<ClipboardScreen environment={environment} clearAfterSeconds={0} />)
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(await screen.findByText('Cleared the clipboard.')).toBeInTheDocument()
    expect(writeText.mock.calls.map(([value]) => value)).toEqual(['730 214', ''])
  })

  it('clears a code still on the clipboard when the topic closes', async () => {
    const user = userEvent.setup()
    const { environment, writeText } = fakeEnvironment()
    const { unmount } = render(<ClipboardScreen environment={environment} />)
    await user.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(await screen.findByText('Clears in 20 s')).toBeInTheDocument()
    unmount()
    expect(writeText).toHaveBeenLastCalledWith('')
  })

  it('reads the clipboard on request, takes a paste without asking, and forgets both', async () => {
    const user = userEvent.setup()
    render(<ClipboardScreen environment={fakeEnvironment('copied elsewhere').environment} />)
    await user.click(screen.getByRole('button', { name: 'Read the clipboard' }))
    expect(await screen.findByLabelText('Clipboard text')).toHaveTextContent('copied elsewhere')

    await user.click(screen.getByRole('textbox', { name: 'Or paste here with Ctrl+V or ⌘V' }))
    await user.paste('pasted words')
    expect(screen.getByText('The paste event gave the page 12 characters, with no prompt.')).toBeInTheDocument()
    expect(screen.getByLabelText('Clipboard text')).toHaveTextContent('pasted words')

    await user.click(screen.getByRole('button', { name: 'Forget it' }))
    expect(screen.queryByLabelText('Clipboard text')).not.toBeInTheDocument()
  })

  it('shows what the browser reports about clipboard access', async () => {
    render(<ClipboardScreen environment={fakeEnvironment().environment} />)
    const access = screen.getByLabelText('Clipboard access')
    expect(await within(access).findByText('Asks first')).toBeInTheDocument()
    expect(within(access).getByText('Granted')).toBeInTheDocument()
    expect(within(access).getByText('Available')).toBeInTheDocument()
  })

  it('explains why nothing works on a page that is not secure', async () => {
    const user = userEvent.setup()
    render(<ClipboardScreen environment={{ clipboard: undefined, permissions: undefined, isSecureContext: false }} />)
    expect(screen.getByText('Not available')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Copy' }))
    expect(await screen.findByText('The Clipboard API works only on secure pages (HTTPS or localhost).')).toBeInTheDocument()
  })
})
