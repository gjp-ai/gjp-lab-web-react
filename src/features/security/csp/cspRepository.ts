/** A `securitypolicyviolation` event, reduced to what the topic shows. */
export interface PolicyViolation {
  /** The directive that blocked it, such as `script-src-elem`. */
  directive: string
  /** `inline`, `eval`, or the blocked URL. */
  blocked: string
}

/**
 * The policy this page was delivered with in a `<meta>` element, or `undefined` when there is none (the dev
 * server). A policy sent as an HTTP header cannot be read from the page.
 */
export function readDeliveredPolicy(document: Pick<Document, 'querySelector'> = window.document): string | undefined {
  return document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') ?? undefined
}

/** Calls `onViolation` each time the browser blocks something on this page. Returns a function that stops. */
export function watchViolations(onViolation: (violation: PolicyViolation) => void, document: EventTarget = window.document): () => void {
  const listener = (event: Event) => {
    const { effectiveDirective, blockedURI } = event as SecurityPolicyViolationEvent
    onViolation({ directive: effectiveDirective, blocked: blockedURI })
  }
  document.addEventListener('securitypolicyviolation', listener)
  return () => document.removeEventListener('securitypolicyviolation', listener)
}

export type ProbeResult = 'ran' | 'blocked'

/** Attempts that the site policy forbids. Without a policy (the dev server) they run. Each cleans up after itself. */
export interface PolicyProbes {
  inlineScript: () => ProbeResult
  evaluate: () => ProbeResult
  inlineStyle: () => ProbeResult
}

export function browserProbes(document: Document = window.document): PolicyProbes {
  return {
    inlineScript() {
      const script = document.createElement('script')
      // An allowed inline script runs as soon as it is added, before append returns.
      script.textContent = "document.documentElement.dataset.cspProbe = 'ran'"
      document.body.append(script)
      script.remove()
      const ran = document.documentElement.dataset.cspProbe === 'ran'
      delete document.documentElement.dataset.cspProbe
      return ran ? 'ran' : 'blocked'
    },
    evaluate() {
      try {
        // Turns text into code, like eval. Without 'unsafe-eval' in script-src, this throws an EvalError.
        new Function('return 1 + 1')()
        return 'ran'
      } catch (error) {
        if (error instanceof EvalError) return 'blocked'
        throw error
      }
    },
    inlineStyle() {
      const target = document.createElement('div')
      target.dataset.cspProbe = ''
      const style = document.createElement('style')
      style.textContent = '[data-csp-probe] { --csp-probe: ran; }'
      document.body.append(target, style)
      // A blocked <style> element stays in the page, but its rules are never applied.
      const ran = getComputedStyle(target).getPropertyValue('--csp-probe').trim() === 'ran'
      target.remove()
      style.remove()
      return ran ? 'ran' : 'blocked'
    },
  }
}
