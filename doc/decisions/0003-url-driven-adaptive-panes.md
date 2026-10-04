# 0003: The URL is the navigation state, shown as adaptive panes

Status: Accepted, 2026-10-04. Amended by [0005](0005-desktop-tree-sidebar.md): desktop browsers use a tree sidebar instead of the panes.

## Context

The iOS lab drives a `NavigationSplitView` from selection state: categories, catalogue, and feature side by side on wide screens, one stack on phones. On the web, people also expect every screen to have a URL they can reload, bookmark, and share, and the browser's Back button to move between screens.

## Decision

- React Router owns the selection: `/` (sidebar), `/<category>` (catalogue), `/<category>/<route>` (feature), and `/<category>/<route>/response` (a pushed screen). `ContentView` reads the parameters and never stores navigation state elsewhere.
- `paneLayout(windowWidth)` chooses the layout: one stack below 840 px, two panes from 840 px, three from 1200 px (the Android lab's breakpoints). The same URL is shown at every width.
- An unknown category or topic, or a pushed URL without its data, falls back to the nearest valid level with a replace navigation.
- Panes are plain components (`NavigationPane`, `NavigationPlaceholder`); no layout or navigation library beyond React Router.

## Consequences

- Any topic can be linked or reloaded, and Back works as people expect.
- Large pushed data (an HTTP response) travels in router state rather than the URL, so a copied `/response` link opens the feature instead.
- There are no pane transition animations; add them only with a new decision.

Related: the iOS lab uses selection state in `ContentView`; the Android lab uses selection state and the same breakpoints (Android decision 0005).
