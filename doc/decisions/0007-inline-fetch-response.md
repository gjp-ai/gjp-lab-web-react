# 0007: The fetch response is shown on the fetch page; pushed screens are retired

Status: Accepted, 2026-10-04. Amends [0003](0003-url-driven-adaptive-panes.md).

## Context

Decision 0003 let a feature push a screen on top of itself (`/<category>/<route>/response`), with large data in router state. Only the fetch topic used it, to show the HTTP response. Readers had to go back to change the request, could not see the request and the response together, and a copied or reloaded `/response` link lost its data and fell back to the form anyway.

## Decision

- The fetch page shows the response under the form, in its own section, together with the code for the request.
- The pushed-screen mechanism is removed: `FeatureNavigation`, `ResponseDestination`, `DetailRoute`, the `:detail` route, and the `navigation` prop of feature screens.
- `ContentView` keeps a `/:categoryId/:route/*` route so deeper URLs, including old `/httpClient/fetch/response` links, open their topic with a replace navigation.

## Consequences

- The URL shapes are `/`, `/<category>`, and `/<category>/<route>`. Feature screens take no props from the app.
- A response is screen state: it is lost on reload and is not in the browser history, which matches the earlier behaviour after a reload.
- A future feature that needs its own sub-page should first try showing it in place; bringing back pushed screens needs a new decision.

Related: the iOS lab pushes the response screen; this is a web-only change.
