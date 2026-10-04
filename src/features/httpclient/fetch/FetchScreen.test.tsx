import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FetchScreen } from './FetchScreen'

afterEach(() => {
  vi.unstubAllGlobals()
})

/** No live endpoint in tests: a stub answers as JSONPlaceholder would. */
function stubFetch(status: number, body: string) {
  const fetchMock = vi.fn(async () => new Response(body, { status, headers: { 'content-type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const card = (title: string) => screen.getByRole('region', { name: title })

describe('FetchScreen', () => {
  it('opens on a JSONPlaceholder GET, not a private API', () => {
    render(<FetchScreen />)
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveValue('GET')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://jsonplaceholder.typicode.com/posts/1')
    expect(screen.getByText('GET requests have no body.')).toBeInTheDocument()
    expect(within(card('Response')).getByText('Send a request to see its status, body, and headers here.')).toBeInTheDocument()
  })

  it('fills the form from an example, and the code follows the form', async () => {
    const user = userEvent.setup()
    render(<FetchScreen />)
    await user.click(screen.getByRole('button', { name: 'POST Create a post' }))
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveValue('POST')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://jsonplaceholder.typicode.com/posts')
    expect((screen.getByRole('textbox', { name: 'Body (JSON)' }) as HTMLTextAreaElement).value).toContain('"title": "Hello from GJP Lab"')
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent("method: 'POST'")

    await user.selectOptions(screen.getByRole('combobox', { name: 'Method' }), 'DELETE')
    expect(screen.queryByRole('textbox', { name: 'Body (JSON)' })).not.toBeInTheDocument()
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent("method: 'DELETE'")
  })

  it('switches the examples when another API is chosen', async () => {
    const user = userEvent.setup()
    render(<FetchScreen />)
    const api = screen.getByRole('combobox', { name: 'Examples from' })
    expect(api).toHaveValue('jsonplaceholder')

    await user.selectOptions(api, 'DummyJSON')
    expect(screen.getByRole('link', { name: 'DummyJSON docs' })).toHaveAttribute('href', 'https://dummyjson.com/docs')
    await user.click(screen.getByRole('button', { name: 'POST Add a product' }))
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveValue('POST')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://dummyjson.com/products/add')

    await user.selectOptions(api, 'PokeAPI')
    const pokeExamples = within(screen.getByRole('list', { name: 'PokeAPI examples' })).getAllByRole('button')
    expect(pokeExamples.every((button) => button.textContent?.startsWith('GET'))).toBe(true)
    // Choosing an API does not change the request until an example is chosen.
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://dummyjson.com/products/add')
  })

  it('flags a body that is not JSON, and formats one that is', async () => {
    const user = userEvent.setup()
    render(<FetchScreen />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Method' }), 'PUT')
    const body = screen.getByRole('textbox', { name: 'Body (JSON)' })
    await user.clear(body)
    await user.type(body, '{{"a":1')
    expect(body).toHaveAccessibleDescription('This is not valid JSON. It will be sent as plain text.')
    expect(screen.getByRole('button', { name: 'Format' })).toBeDisabled()

    await user.type(body, '}')
    await user.click(screen.getByRole('button', { name: 'Format' }))
    expect(body).toHaveValue('{\n  "a": 1\n}')
  })

  it('shows the status, time, size, body, and headers on the same page', async () => {
    const fetchMock = stubFetch(201, '{"id":101}')
    const user = userEvent.setup()
    render(<FetchScreen />)
    await user.click(screen.getByRole('button', { name: 'POST Create a post' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(fetchMock).toHaveBeenCalledWith(new URL('https://jsonplaceholder.typicode.com/posts'), expect.objectContaining({ method: 'POST' }))
    const response = card('Response')
    expect(await within(response).findByText('Received HTTP 201.')).toBeInTheDocument()
    expect(within(response).getByText('201 Created')).toHaveClass('text-success')
    expect(within(response).getByText(/ms · 10 B$/)).toBeInTheDocument()
    expect(within(response).getByRole('tabpanel')).toHaveTextContent('"id": 101')

    await user.click(within(response).getByRole('tab', { name: /Headers/ }))
    expect(within(response).getByRole('tabpanel')).toHaveTextContent('content-typeapplication/json')
  })

  it('replaces the response with an error and sends nothing for an invalid URL', async () => {
    const fetchMock = stubFetch(200, '{}')
    const user = userEvent.setup()
    render(<FetchScreen />)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Received HTTP 200.')).toBeInTheDocument()

    const url = screen.getByRole('textbox', { name: 'URL' })
    await user.clear(url)
    await user.type(url, 'example.com')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid http:// or https:// URL.')
    expect(screen.queryByText('200 OK')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shows the code of the request implementation', async () => {
    const user = userEvent.setup()
    render(<FetchScreen />)
    await user.click(within(card('Code')).getByRole('tab', { name: 'fetchRepository.ts' }))
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent('export async function executeRequest(')
  })
})
