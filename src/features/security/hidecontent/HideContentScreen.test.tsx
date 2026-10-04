import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { PreferenceStorage } from '@/common/config/preferenceStorage'
import { HideContentScreen } from './HideContentScreen'
import type { PageEnvironment } from './pageActivityRepository'

class FakeDocument extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible'
  focused = true
  hasFocus() {
    return this.focused
  }
}

function memoryStorage(): PreferenceStorage & { values: Map<string, string> } {
  const values = new Map<string, string>()
  return { values, getItem: (key) => values.get(key) ?? null, setItem: (key, value) => void values.set(key, value) }
}

/** Renders the screen on a fake page, with helpers that fire the events a browser would. */
function renderScreen(storage = memoryStorage()) {
  const page = { document: new FakeDocument(), window: new EventTarget() } satisfies PageEnvironment
  render(<HideContentScreen environment={page} storage={storage} />)
  return {
    storage,
    setVisible: (isVisible: boolean) =>
      act(() => {
        page.document.visibilityState = isVisible ? 'visible' : 'hidden'
        page.document.dispatchEvent(new Event('visibilitychange'))
      }),
    setFocused: (hasFocus: boolean) =>
      act(() => {
        page.document.focused = hasFocus
        page.window.dispatchEvent(new Event(hasFocus ? 'focus' : 'blur'))
      }),
  }
}

const cardNumber = '4242 4242 4242 4242'

describe('HideContentScreen', () => {
  it('removes the sample content while the page is hidden and brings it back after', () => {
    const { setVisible } = renderScreen()
    expect(screen.getByText(cardNumber)).toBeInTheDocument()

    setVisible(false)
    expect(screen.queryByText(cardNumber)).not.toBeInTheDocument()
    expect(screen.getByText('Hidden because the page went into the background.')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
    expect(screen.getByText('Page hidden: content hidden')).toBeInTheDocument()

    setVisible(true)
    expect(screen.getByText(cardNumber)).toBeInTheDocument()
    expect(screen.getByText('Page visible: content shown')).toBeInTheDocument()
  })

  it('keeps the content hidden until Show content when asked, and saves that choice', async () => {
    const user = userEvent.setup()
    const { setVisible, storage } = renderScreen()
    await user.click(screen.getByRole('checkbox', { name: 'Keep hidden until I choose to show it' }))
    expect(storage.values.get('gjpLab.hideContent')).toContain('"untilShown":true')

    setVisible(false)
    setVisible(true)
    expect(screen.queryByText(cardNumber)).not.toBeInTheDocument()
    expect(screen.getByText('Page visible: content stays hidden')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show content' }))
    expect(screen.getByText(cardNumber)).toBeInTheDocument()
  })

  it('hides on focus loss only when that setting is on', async () => {
    const user = userEvent.setup()
    const { setFocused } = renderScreen()
    setFocused(false)
    expect(screen.getByText(cardNumber)).toBeInTheDocument()
    expect(screen.getByText('Window lost focus: content unchanged')).toBeInTheDocument()
    setFocused(true)

    await user.click(screen.getByRole('checkbox', { name: 'Also hide when the window loses focus' }))
    setFocused(false)
    expect(screen.getByText('Hidden because the window lost focus.')).toBeInTheDocument()
    setFocused(true)
    expect(screen.getByText(cardNumber)).toBeInTheDocument()
  })

  it('keeps content hidden with Hide now until Show content, without moving focus', async () => {
    const user = userEvent.setup()
    const { setVisible } = renderScreen()
    await user.click(screen.getByRole('button', { name: 'Hide now' }))
    expect(screen.getByText('Hidden with Hide now.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show content' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Sample content hidden.')

    setVisible(false)
    setVisible(true)
    expect(screen.queryByText(cardNumber)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show content' }))
    expect(screen.getByText(cardNumber)).toBeInTheDocument()
    expect(screen.getByText('You showed the content')).toBeInTheDocument()
  })

  it('starts from the saved settings', () => {
    const storage = memoryStorage()
    storage.setItem('gjpLab.hideContent', '{"whenHidden":false,"whenUnfocused":true,"untilShown":false}')
    renderScreen(storage)
    expect(screen.getByRole('checkbox', { name: 'Hide when the page is hidden' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Also hide when the window loses focus' })).toBeChecked()
  })
})
