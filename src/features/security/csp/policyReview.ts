export type FindingSeverity = 'high' | 'medium' | 'info'

/** One weakness, or a note, about a policy. */
export interface PolicyFinding {
  severity: FindingSeverity
  directive: string
  message: string
}

const knownDirectives = new Set([
  'default-src',
  'script-src',
  'script-src-elem',
  'script-src-attr',
  'style-src',
  'style-src-elem',
  'style-src-attr',
  'img-src',
  'font-src',
  'connect-src',
  'media-src',
  'object-src',
  'frame-src',
  'child-src',
  'worker-src',
  'manifest-src',
  'base-uri',
  'form-action',
  'upgrade-insecure-requests',
  'require-trusted-types-for',
  'trusted-types',
])

/** Valid in a header, but ignored when the policy is delivered in a `<meta>` element. */
const headerOnlyDirectives = new Set(['frame-ancestors', 'report-uri', 'report-to', 'sandbox'])

const severityOrder: Record<FindingSeverity, number> = { high: 0, medium: 1, info: 2 }

/**
 * Directive names (in lower case) and their sources, in order. As in browsers, directives are separated by
 * `;`, and a repeated directive is ignored.
 */
export function parsePolicy(text: string): Map<string, string[]> {
  const directives = new Map<string, string[]>()
  for (const part of text.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/).filter(Boolean)
    if (name !== undefined && !directives.has(name.toLowerCase())) directives.set(name.toLowerCase(), sources)
  }
  return directives
}

/**
 * Common weaknesses in a policy, most serious first. Script rules come from script-src, or default-src when it
 * is missing. This is a teaching aid, not a complete audit.
 */
export function reviewPolicy(text: string): PolicyFinding[] {
  const policy = parsePolicy(text)
  if (policy.size === 0) return [{ severity: 'high', directive: '—', message: 'The policy is empty, so nothing is restricted.' }]

  const findings: PolicyFinding[] = []
  const add = (severity: FindingSeverity, directive: string, message: string) => findings.push({ severity, directive, message })

  for (const name of policy.keys()) {
    if (headerOnlyDirectives.has(name)) add('info', name, `${name} is ignored in a <meta> policy; send it in a Content-Security-Policy header.`)
    else if (!knownDirectives.has(name)) add('info', name, `${name} is not a directive browsers know, so it is ignored.`)
  }

  const scriptDirective = policy.has('script-src') ? 'script-src' : policy.has('default-src') ? 'default-src' : undefined
  if (scriptDirective === undefined) {
    add('high', 'script-src', 'No script-src or default-src: scripts may come from anywhere, including inline code.')
  } else {
    const sources = (policy.get(scriptDirective) ?? []).map((source) => source.toLowerCase())
    const hasHashOrNonce = sources.some((source) => /^'(nonce|sha256|sha384|sha512)-/.test(source))
    if (sources.includes("'unsafe-inline'")) {
      if (hasHashOrNonce) add('info', scriptDirective, "'unsafe-inline' is ignored because a hash or nonce is present; it only helps very old browsers.")
      else add('high', scriptDirective, "'unsafe-inline' lets injected inline scripts run, which undoes most of the protection.")
    }
    if (sources.includes("'unsafe-eval'")) add('medium', scriptDirective, "'unsafe-eval' allows eval() and new Function(), which turn text into code.")
    for (const wide of ['*', 'https:', 'data:']) {
      if (sources.includes(wide)) add('high', scriptDirective, `${wide} lets scripts load from ${wide === 'data:' ? 'data: URLs' : 'any host'}.`)
    }
    if (sources.includes("'strict-dynamic'")) {
      add('info', scriptDirective, "'strict-dynamic' trusts scripts that trusted scripts load, and ignores host sources.")
    }
  }

  for (const [name, sources] of policy) {
    for (const source of sources.filter((value) => /^http:/i.test(value))) {
      add(name === scriptDirective ? 'high' : 'medium', name, `${source} allows plain http, which can be read or changed on the way.`)
    }
  }

  const objectSources = policy.get('object-src') ?? policy.get('default-src')
  if (!objectSources?.some((source) => source.toLowerCase() === "'none'")) add('medium', 'object-src', "Plugins are allowed; set object-src 'none'.")
  if (!policy.has('base-uri')) {
    add('medium', 'base-uri', 'No base-uri (it does not fall back to default-src): an injected <base> element could change where relative links point.')
  }

  if (!findings.some((finding) => finding.severity !== 'info')) add('info', '—', 'No common weaknesses found.')
  return findings.toSorted((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}
