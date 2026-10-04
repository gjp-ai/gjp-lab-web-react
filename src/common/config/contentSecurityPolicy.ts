/** One rule of a Content Security Policy: a kind of resource and the sources it may come from. */
export interface PolicyDirective {
  name: string
  sources: readonly string[]
  /** What the rule allows and blocks here, shown on the Content Security Policy topic. */
  purpose: string
}

/**
 * The policy the production build puts in index.html as a `<meta http-equiv="Content-Security-Policy">`
 * element (see `vite.config.ts`, which adds a hash for each inline script to script-src). The dev server adds
 * inline scripts of its own for hot reload, so it runs without a policy. This file is also compiled for
 * `vite.config.ts`, so it must not use browser types.
 */
export const sitePolicy: readonly PolicyDirective[] = [
  { name: 'default-src', sources: ["'self'"], purpose: 'Anything without its own rule below may come only from this site.' },
  {
    name: 'script-src',
    sources: ["'self'"],
    purpose:
      "Scripts only from this site's files, plus the inline colour-scheme script in index.html, allowed by its SHA-256 hash. Other inline code, eval, and other hosts are blocked.",
  },
  { name: 'style-src', sources: ["'self'"], purpose: "Style sheets only from this site's files; inline <style> elements are blocked." },
  { name: 'img-src', sources: ["'self'"], purpose: 'Images only from this site.' },
  {
    name: 'connect-src',
    sources: ["'self'", 'https:'],
    purpose: 'fetch and axios may call this site and any HTTPS address, which the HTTP Client topics need. Plain http is blocked.',
  },
  { name: 'object-src', sources: ["'none'"], purpose: 'No plugins (<object> and <embed>).' },
  { name: 'base-uri', sources: ["'none'"], purpose: 'No <base> element, so injected markup cannot change where relative links point.' },
  { name: 'form-action', sources: ["'self'"], purpose: 'Forms may only submit to this site.' },
]

/** The policy as one header or meta value, with each `sha256-…` hash added to script-src. */
export function serializePolicy(directives: readonly PolicyDirective[], scriptHashes: readonly string[] = []): string {
  return directives
    .map((directive) => {
      const hashes = directive.name === 'script-src' ? scriptHashes.map((hash) => `'${hash}'`) : []
      return [directive.name, ...directive.sources, ...hashes].join(' ')
    })
    .join('; ')
}

/** The text of each inline `<script>` (one without `src`) in an HTML page, exactly as the browser hashes it. */
export function inlineScripts(html: string): string[] {
  return [...html.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1])
}
