# 0002: Sidebar and catalogue content in `navigation.json`; routes stay in TypeScript

Status: Accepted, 2026-10-04

## Context

The sidebar and catalogue need each category's title, summary, description, and icon, and each topic's title, description, and availability. Keeping that text in components would mean editing JSX to rename a topic, and makes it easy for the sidebar and catalogue to drift apart.

## Decision

- All categories and topics, in display order, live in `src/app/navigation/navigation.json`, parsed by `parseNavigationMenu` in `NavigationMenu.ts`.
- A topic's optional `"route"` must be a value in `featureRoutes` (`FeatureRoute.ts`). A topic without a route is shown as planned. An icon must be one of the names `CategoryIcon` can draw.
- A top-level `"featured"` list names the routes the home page offers as quick links; each must be a listed topic.
- The mapping from route to screen stays in TypeScript, in `FeatureDestination`. The JSON never names a component.
- The bundled JSON is trusted app content: if it is invalid, parsing throws with a clear message when the app loads.

## Consequences

- Menu text, icons, order, and planned topics change without touching components.
- A feature is still a code change: a route in `featureRoutes`, its screen in `FeatureDestination`, and the JSON entry.
- `NavigationMenu.test.ts` guards the link: the bundled JSON parses, every route appears exactly once, and an unknown route or icon is rejected.
- The JSON is bundled, not downloaded. Serving it remotely would need a fallback and a new decision.

Related: iOS decision 0004 makes the same choice.
