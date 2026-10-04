import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import type { PolicyProbes } from './cspRepository'
import { CspScreen } from './CspScreen'

const blockingProbes: PolicyProbes = { inlineScript: () => 'blocked', evaluate: () => 'blocked', inlineStyle: () => 'blocked' }

afterEach(() => {
  document.head.querySelector('meta[http-equiv]')?.remove()
})

describe('CspScreen', () => {
  it('lists the site policy and says when it is not in force', () => {
    render(<CspScreen probes={blockingProbes} />)
    expect(screen.getByText(/^Not in force/)).toBeInTheDocument()
    expect(screen.getByText(/No plugins \(<object> and <embed>\)/)).toBeInTheDocument()
    expect(screen.queryByText('Policy as delivered')).not.toBeInTheDocument()
  })

  it('shows the delivered policy when the page has one', () => {
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = "default-src 'self'"
    document.head.append(meta)
    render(<CspScreen probes={blockingProbes} />)
    expect(screen.getByText('In force on this page.')).toBeInTheDocument()
    expect(screen.getByText('Policy as delivered')).toBeInTheDocument()
  })

  it('reports each attempt and each violation', async () => {
    const user = userEvent.setup()
    render(<CspScreen probes={blockingProbes} />)
    await user.click(screen.getByRole('button', { name: 'Run an inline script' }))
    expect(screen.getByText('Blocked by the policy.')).toBeInTheDocument()

    act(() => {
      document.dispatchEvent(Object.assign(new Event('securitypolicyviolation'), { effectiveDirective: 'script-src-elem', blockedURI: 'inline' }))
    })
    expect(within(screen.getByRole('list', { name: 'Violation reports' })).getByText('script-src-elem blocked inline')).toBeInTheDocument()
  })

  it('says an attempt ran when no policy is in force', async () => {
    const user = userEvent.setup()
    render(<CspScreen probes={{ ...blockingProbes, evaluate: () => 'ran' }} />)
    await user.click(screen.getByRole('button', { name: 'Call new Function()' }))
    expect(screen.getByText('Ran: no policy is in force here.')).toBeInTheDocument()
  })

  it('checks an edited policy and resets it', async () => {
    const user = userEvent.setup()
    render(<CspScreen probes={blockingProbes} />)
    const findings = screen.getByRole('list', { name: 'Findings' })
    expect(within(findings).getByText('No common weaknesses found.')).toBeInTheDocument()

    const field = screen.getByRole('textbox', { name: 'Policy' })
    await user.clear(field)
    await user.type(field, "script-src 'self' 'unsafe-inline'")
    expect(within(findings).getByText(/'unsafe-inline' lets injected inline scripts run/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: "Reset to this site's policy" }))
    expect(within(findings).getByText('No common weaknesses found.')).toBeInTheDocument()
  })
})
