# Category sidebar detailed design

Status: Implemented, with known gaps

Requirements: [Category sidebar](sidebar_requirement.md)

## Implementation goal

Use one root component, `ContentView`, for every window size. The URL holds the selection, and `paneLayout` decides how many panes show it ([decision 0003](../../../decisions/0003-url-driven-adaptive-panes.md)).

## Source map

| Source | Responsibility |
| --- | --- |
| [`ContentView.tsx`](../../../../src/app/ContentView.tsx) | Routes, URL validation and fallbacks, pane layout, and `FeatureNavigation` |
| [`paneLayout.ts`](../../../../src/app/navigation/paneLayout.ts) | `paneLayout` breakpoints and `useWindowWidth` |
| [`NavigationPane.tsx`](../../../../src/app/navigation/NavigationPane.tsx) | `NavigationPane` (header, back link, scrolling width-limited content) and `NavigationPlaceholder` |
| [`CategorySidebar.tsx`](../../../../src/app/navigation/CategorySidebar.tsx) | Category list |
| [`CategoryIcon.tsx`](../../../../src/app/navigation/CategoryIcon.tsx) | Inline icons in a tinted tile |
| [`LabListCard.tsx`](../../../../src/common/theme/LabListCard.tsx) | The bordered card used by every sidebar and catalogue row |
| [`FeatureDestination.tsx`](../../../../src/app/FeatureDestination.tsx) | Maps a route to its lazily loaded screen |
| [`NavigationMenu.ts`](../../../../src/app/navigation/NavigationMenu.ts) and [`navigation.json`](../../../../src/app/navigation/navigation.json) | Category and topic content |

## Navigation model

| URL part | Meaning | Invalid value |
| --- | --- | --- |
| `:categoryId` | Selected category | Replace with `/` |
| `:route` | Selected `FeatureRoute`, which must belong to the category | Replace with `/<category>` |
| `:detail` | Pushed screen (`response`), which needs router state | Replace with `/<category>/<route>` |

| Layout | Window width | Panes |
| --- | --- | --- |
| `three` | ≥ 1200 px | Sidebar (320 px) │ catalogue or placeholder (360 px) │ feature or placeholder |
| `two` | 840–1199 px | Sidebar, or catalogue with a back link (360 px) │ feature or placeholder |
| `single` | < 840 px | The deepest selected level, with a back link to its parent |

Back links are ordinary `Link`s to the parent URL, so they and the browser's Back button agree. Each pane scrolls on its own; the page itself never scrolls.

## Rows

Each sidebar row is a `LabListCard` link: a `surface` card with 18 px corners, a 0.5 px `outline-variant` border (1 px `primary` when selected), 16 px padding, and 12 px between cards. It holds the icon in a 44 px `primary-container` tile, the title, and the summary in `on-surface-variant`. The selected row sets `aria-current="page"`.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| No pane transitions | Level changes on phones are instant | Use the View Transitions API with React Router's `viewTransition` |
| Scroll position resets when a pane leaves the page | Returning to the catalogue on a phone starts at the top | Use React Router's scroll restoration per pane |
| The window width is read in JavaScript | The first render after a resize waits for the resize event | Acceptable; switch to CSS container queries if flicker appears |

## Verification

- Automated: `ContentView.test.tsx` (phone stack with Back, three panes with `aria-current`, the medium placeholder, planned topics without links, unknown-URL fallback, pushed URL without data); `paneLayout.test.ts`; `NavigationMenu.test.ts`.
- Manual: SDB-AC-01 to SDB-AC-06 in Chrome and Safari at 375, 1000, and 1400 px, keyboard only, in light and dark mode.
