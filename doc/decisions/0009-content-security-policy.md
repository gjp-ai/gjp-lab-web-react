# 0009: A Content Security Policy in the production build

Status: Accepted, 2026-10-04. Follows [0006](0006-colour-scheme-toggle.md), which required a hash for the inline theme script.

## Context

The Security category's Content Security Policy topic is only convincing if the site enforces a policy itself. The lab is static files with no server code, so the policy cannot rely on per-request nonces. In development, Vite's dev server and the React plugin inject inline scripts and styles for hot reload, which a strict policy would block.

## Decision

- `src/common/config/contentSecurityPolicy.ts` defines the policy once, as a list of directives, each with a sentence explaining it: `default-src 'self'`, `script-src 'self'` plus hashes, `style-src 'self'`, `img-src 'self'`, `connect-src 'self' https:`, `object-src 'none'`, `base-uri 'none'`, and `form-action 'self'`.
- A small plugin in `vite.config.ts` (build only) hashes each inline script in index.html with SHA-256 and adds the policy as the first element in `<head>`, as `<meta http-equiv="Content-Security-Policy">`. Editing the theme script updates its hash automatically.
- The dev server runs without a policy. `npm run build` then `npm run preview` shows the site as it will be deployed.
- The Content Security Policy topic shows the same directive list, reads the delivered policy from the page, and demonstrates blocked attempts.

## Consequences

- No inline scripts other than hashed ones in index.html, no inline `<style>` elements, no `eval` or `new Function`, and no scripts, styles, or images from other hosts. A library that needs any of these must change the policy, which is a project-wide decision.
- `connect-src` allows any HTTPS address because the HTTP Client topics send requests to URLs the person types. Plain http requests are blocked in the production build.
- A `<meta>` policy cannot set `frame-ancestors`, `report-to`, or `sandbox`. The server should send `Content-Security-Policy: frame-ancestors 'none'` as a header to stop other sites framing the lab.
- `contentSecurityPolicy.ts` is also compiled for `vite.config.ts`, so it must not use browser types or `@/` imports.
- Check changes that load new kinds of resources in `npm run preview` with the console open.

Related: the iOS and Android labs have no equivalent; this is a web-only protection.
