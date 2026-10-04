import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { type HttpClient, HttpClientScreen } from './HttpClientScreen'
import type { HttpResponse } from './HttpResponse'
import { HttpRequestError, parseHttpUrl } from './httpRequest'

/** A client that answers at once, so the tests check the shared layout and state, not a library. */
function fakeClient(answer: HttpResponse = { status: 200, body: '{}', headers: [], durationMs: 5, sizeBytes: 2 }) {
  const send = vi.fn(async (_method: string, url: string) => {
    parseHttpUrl(url)
    return answer
  })
  const client: HttpClient = {
    intro: 'Try the fake client.',
    send,
    snippet: (method, url) => `fake.${method.toLowerCase()}('${url}')`,
    snippetCaption: 'The fake call.',
    invalidJsonHint: 'Not JSON, sent anyway.',
    source: { fileName: 'fakeRepository.ts', code: 'export function fakeSend() {}', caption: 'The fake source.' },
  }
  return { client, send }
}

function TestScreen({ client = fakeClient().client }: { client?: HttpClient }) {
  return <HttpClientScreen client={client}>{<p>Extra section</p>}</HttpClientScreen>
}

const card = (title: string) => screen.getByRole('region', { name: title })

describe('HttpClientScreen', () => {
  it('opens on a JSONPlaceholder GET, not a private API, with the topic’s intro and extra content', () => {
    render(<TestScreen />)
    expect(screen.getByText('Try the fake client.')).toBeInTheDocument()
    expect(screen.getByText('Extra section')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveValue('GET')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://jsonplaceholder.typicode.com/posts/1')
    expect(screen.getByText('GET requests have no body.')).toBeInTheDocument()
    expect(within(card('Response')).getByText('Send a request to see its status, body, and headers here.')).toBeInTheDocument()
  })

  it('fills the form from an example, and the code follows the form', async () => {
    const user = userEvent.setup()
    render(<TestScreen />)
    await user.click(screen.getByRole('button', { name: 'POST Create a post' }))
    expect(screen.getByRole('combobox', { name: 'Method' })).toHaveValue('POST')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveValue('https://jsonplaceholder.typicode.com/posts')
    expect((screen.getByRole('textbox', { name: 'Body (JSON)' }) as HTMLTextAreaElement).value).toContain('"title": "Hello from GJP Lab"')
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent("fake.post('https://jsonplaceholder.typicode.com/posts')")

    await user.selectOptions(screen.getByRole('combobox', { name: 'Method' }), 'DELETE')
    expect(screen.queryByRole('textbox', { name: 'Body (JSON)' })).not.toBeInTheDocument()
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent('fake.delete(')
  })

  it('switches the examples when another API is chosen', async () => {
    const user = userEvent.setup()
    render(<TestScreen />)
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
    render(<TestScreen />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Method' }), 'PUT')
    const body = screen.getByRole('textbox', { name: 'Body (JSON)' })
    await user.clear(body)
    await user.type(body, '{{"a":1')
    expect(body).toHaveAccessibleDescription('Not JSON, sent anyway.')
    expect(screen.getByRole('button', { name: 'Format' })).toBeDisabled()

    await user.type(body, '}')
    await user.click(screen.getByRole('button', { name: 'Format' }))
    expect(body).toHaveValue('{\n  "a": 1\n}')
  })

  it('shows the status, time, size, body, and headers on the same page', async () => {
    const { client, send } = fakeClient({
      status: 201,
      body: '{\n  "id": 101\n}',
      headers: [['content-type', 'application/json']],
      durationMs: 42,
      sizeBytes: 10,
    })
    const user = userEvent.setup()
    render(<TestScreen client={client} />)
    await user.click(screen.getByRole('button', { name: 'POST Create a post' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(send).toHaveBeenCalledWith('POST', 'https://jsonplaceholder.typicode.com/posts', expect.stringContaining('Hello from GJP Lab'), expect.any(AbortSignal))
    const response = card('Response')
    expect(await within(response).findByText('Received HTTP 201.')).toBeInTheDocument()
    expect(within(response).getByText('201 Created')).toHaveClass('text-success')
    expect(within(response).getByText('42 ms · 10 B')).toBeInTheDocument()
    expect(within(response).getByRole('tabpanel')).toHaveTextContent('"id": 101')

    await user.click(within(response).getByRole('tab', { name: /Headers/ }))
    expect(within(response).getByRole('tabpanel')).toHaveTextContent('content-typeapplication/json')
  })

  it('replaces the response with the client’s error message', async () => {
    const { client, send } = fakeClient()
    const user = userEvent.setup()
    render(<TestScreen client={client} />)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText('Received HTTP 200.')).toBeInTheDocument()

    const url = screen.getByRole('textbox', { name: 'URL' })
    await user.clear(url)
    await user.type(url, 'example.com')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid http:// or https:// URL.')
    expect(screen.queryByText('200 OK')).not.toBeInTheDocument()
    expect(send).toHaveBeenCalledTimes(2)
    await expect(send.mock.results[1].value).rejects.toBeInstanceOf(HttpRequestError)
  })

  it('shows the code of the client implementation', async () => {
    const user = userEvent.setup()
    render(<TestScreen />)
    await user.click(within(card('Code')).getByRole('tab', { name: 'fakeRepository.ts' }))
    expect(within(card('Code')).getByRole('tabpanel')).toHaveTextContent('export function fakeSend() {}')
  })
})
