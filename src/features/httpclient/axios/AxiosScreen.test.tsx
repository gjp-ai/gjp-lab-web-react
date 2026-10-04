import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AxiosScreen } from './AxiosScreen'

// No live endpoint in tests: the repository is replaced, so axios never opens a connection.
vi.mock('./axiosRepository', () => ({
  executeAxiosRequest: vi.fn(async () => ({ status: 200, body: '{\n  "id": 1\n}', headers: [], durationMs: 12, sizeBytes: 8 })),
}))

describe('AxiosScreen', () => {
  it('sends with axios and shows the axios code and the comparison', async () => {
    const { executeAxiosRequest } = await import('./axiosRepository')
    const user = userEvent.setup()
    render(<AxiosScreen />)

    expect(within(screen.getByRole('region', { name: 'Code' })).getByRole('tabpanel')).toHaveTextContent(
      "axios.get('https://jsonplaceholder.typicode.com/posts/1')",
    )
    // jsdom applies no CSS, so both the narrow list and the wide table are present here.
    expect(screen.getByRole('rowheader', { name: 'HTTP errors such as 404 or 500' })).toBeInTheDocument()
    expect(screen.getAllByText('HTTP errors such as 404 or 500')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Received HTTP 200.')).toBeInTheDocument()
    expect(executeAxiosRequest).toHaveBeenCalledWith('GET', 'https://jsonplaceholder.typicode.com/posts/1', expect.any(String), {
      signal: expect.any(AbortSignal),
    })

    await user.click(screen.getByRole('tab', { name: 'axiosRepository.ts' }))
    expect(within(screen.getByRole('region', { name: 'Code' })).getByRole('tabpanel')).toHaveTextContent('axios.create(')
  })
})
