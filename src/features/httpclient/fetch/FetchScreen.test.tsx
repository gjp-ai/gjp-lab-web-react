import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FetchScreen } from './FetchScreen'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FetchScreen', () => {
  it('sends the request with fetch and shows the fetch code', async () => {
    // No live endpoint in tests: a stub answers as JSONPlaceholder would.
    const fetchMock = vi.fn(async () => new Response('{"id":1}', { status: 200, headers: { 'content-type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<FetchScreen />)

    expect(screen.getByText(/native fetch API/)).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Code' })).getByRole('tabpanel')).toHaveTextContent('await fetch(')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Received HTTP 200.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://jsonplaceholder.typicode.com/posts/1'), expect.objectContaining({ method: 'GET' }))

    await user.click(screen.getByRole('tab', { name: 'fetchRepository.ts' }))
    expect(within(screen.getByRole('region', { name: 'Code' })).getByRole('tabpanel')).toHaveTextContent('export async function executeRequest(')
  })
})
