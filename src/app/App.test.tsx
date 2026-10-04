import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

function stubMaintenance(...flags: boolean[]) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ maintenanceEnabled: flags.shift() ?? false })))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderApp() {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('shows an empty loading page, then the navigation when maintenance is off', async () => {
    stubMaintenance(false)
    renderApp()
    expect(screen.getByLabelText('Loading GJP Lab')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()
  })

  it('shows maintenance when the flag is on, and opens the app once a retry finds it off', async () => {
    const fetchMock = stubMaintenance(true, false)
    const user = userEvent.setup()
    renderApp()
    expect(await screen.findByRole('heading', { name: "We'll be back soon" })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'GJP Lab' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
