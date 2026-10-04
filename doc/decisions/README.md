# Decision records

Short notes on project choices that the code alone does not explain. Read them before reversing one of these choices; write a new record (rather than editing an old one) when a decision changes.

## Format

File name: `NNNN-short-title.md`, numbered in order. Each record has:

- **Status:** Accepted, or Superseded by a later record (with a link).
- **Context:** the problem and the forces at play.
- **Decision:** what was chosen.
- **Consequences:** what becomes easier, what becomes harder, and the rules that follow.

A record may end with a one-line **Related** note pointing to the matching choice in the iOS lab (`gjp-lab-ios-swift`).

## Records

| # | Decision | Date |
| --- | --- | --- |
| [0001](0001-flat-feature-folders.md) | One flat folder per feature and per app area, mirroring the iOS lab | 2026-10-04 |
| [0002](0002-navigation-menu-in-json.md) | Sidebar and catalogue content in `navigation.json`; routes stay in TypeScript | 2026-10-04 |
| [0003](0003-url-driven-adaptive-panes.md) | The URL is the navigation state, shown as adaptive panes | 2026-10-04 |
| [0004](0004-tailwind-slate-tokens.md) | Slate design tokens in Tailwind, with no component library | 2026-10-04 |
| [0005](0005-desktop-tree-sidebar.md) | A tree sidebar for desktop browsers; touch screens keep the panes | 2026-10-04 |
| [0006](0006-colour-scheme-toggle.md) | A light and dark toggle that overrides the system setting | 2026-10-04 |
| [0007](0007-inline-fetch-response.md) | The fetch response is shown on the fetch page; pushed screens are retired | 2026-10-04 |
| [0008](0008-shared-http-client-layout-and-axios.md) | The HTTP client topics share one layout; axios is the first runtime library | 2026-10-04 |
| [0009](0009-content-security-policy.md) | A Content Security Policy in the production build | 2026-10-04 |
