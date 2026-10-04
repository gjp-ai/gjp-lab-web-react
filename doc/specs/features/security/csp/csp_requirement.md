# Feature: Content Security Policy

Status: Implemented

## Goal

Show what a Content Security Policy is by enforcing one on this site and letting the person watch it block things, as a learning sample for limiting which scripts and resources a page may load.

## Scope

### In scope

- A real policy on the production build of the whole site ([decision 0009](../../../../decisions/0009-content-security-policy.md)).
- The site's directives, each with a plain explanation, and whether the policy is in force on the current page.
- Three attempts the policy forbids (an inline script, `new Function()`, an inline `<style>`) and their results.
- The browser's `securitypolicyviolation` reports for this page.
- A policy checker that lists common weaknesses in a policy the person edits or pastes.
- A plain statement of what a policy cannot do.

### Out of scope

- Sending violation reports to a server (needs a header policy and an endpoint).
- Nonces, which need a server that changes each response.
- Trusted Types, and setting HTTP headers (the lab is static files).

## Behavior

- In the production build, the page is delivered with the policy in a `<meta>` element, and the topic says it is in force. On the development server there is no policy, and the topic says so and how to see it (`npm run build`, then `npm run preview`).
- Each attempt button reports **Blocked by the policy.** or that it ran. With the policy in force, all three are blocked; without it, all three run. Attempts leave nothing behind in the page.
- Each blocked attempt, and anything else the policy blocks on the page, adds a line to **Violation reports** (the directive and what was blocked). The list keeps the last six and is cleared when the screen closes.
- The checker starts with the delivered policy, or the site policy in development, and updates its findings as the text changes. **Reset to this site's policy** restores the starting text.

## UI & Navigation

- Entry point: **Security** → **Content Security Policy** (`/security/csp`).
- An introduction and five cards: **This site's policy**, **Try what it blocks**, **Violation reports**, **Check a policy**, and **What a policy cannot do**.
- Findings show a severity (High, Medium, Note), the directive, and a sentence.
- Every control is keyboard-reachable and labelled; attempt results are announced politely. Light and dark mode, text zoom, and phone width are supported.

## Rules & Constraints

- The site policy allows no `'unsafe-inline'` or `'unsafe-eval'`; the inline theme script in index.html is allowed by its SHA-256 hash, computed at build time.
- The policy must not include directives a `<meta>` policy ignores (`frame-ancestors`, `report-uri`, `report-to`, `sandbox`), because browsers warn about them.
- Every topic must work in the production build with no violations.
- The checker runs in the page; nothing is sent or stored.

## Platform limitations

- A `<meta>` policy applies only to what comes after it, so it is the first element in `<head>`. It cannot stop other sites framing the page; that needs a `frame-ancestors` header from the server.
- `connect-src` allows any HTTPS address, which the HTTP Client topics need.
- A policy cannot protect against code it allows, such as a tampered file from this site.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| CSP-AC-01 | Open the topic in `npm run dev` | It says the policy is not in force; each attempt reports that it ran. |
| CSP-AC-02 | Open it in `npm run preview` | It says the policy is in force and shows the delivered text, including a `sha256-` hash. |
| CSP-AC-03 | In preview, try each attempt | Each reports **Blocked by the policy.**, and **Violation reports** lists `script-src-elem`, `script-src`, and `style-src-elem`. |
| CSP-AC-04 | In preview, open every topic, run the TypeScript samples, and send a fetch request | No violations are reported and every topic works. |
| CSP-AC-05 | In preview, choose dark mode and reload | The page opens dark: the hashed theme script ran. |
| CSP-AC-06 | Type `script-src 'self' 'unsafe-inline'` into the checker | A High finding explains `'unsafe-inline'`, with Medium findings for object-src and base-uri. |
| CSP-AC-07 | Select **Reset to this site's policy** | The text returns, and the checker finds no common weaknesses. |

## Technical implementation constraints

- The policy lives in `src/common/config/contentSecurityPolicy.ts` and is added by a build-only plugin in `vite.config.ts`.
- Source lives in `src/features/security/csp/`: route `csp`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The screen does not read browser APIs directly: a repository reads the delivered policy, watches violations, and runs the attempts. The checker is a pure function with unit tests.
- No new dependencies.

## Related documents

- [Detailed design](csp_detail_design.md)
- [Decision 0009: a Content Security Policy in the production build](../../../../decisions/0009-content-security-policy.md)
