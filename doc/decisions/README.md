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
