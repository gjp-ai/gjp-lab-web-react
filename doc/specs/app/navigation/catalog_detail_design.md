# Category catalogue detailed design

Status: Implemented, with known gaps

Requirements: [Category catalogue](catalog_requirement.md)

## Implementation goal

Render a category's topics as a list of cards, derive availability from whether a topic has a route, and link each available topic to its URL.

## Source map

| Source | Responsibility |
| --- | --- |
| [`FeatureCatalogScreen.tsx`](../../../../src/app/navigation/FeatureCatalogScreen.tsx) | Description, topic cards, and `CatalogRow` |
| [`LabListCard.tsx`](../../../../src/common/theme/LabListCard.tsx) | Link card, or a plain card when there is no route |
| [`navigation.json`](../../../../src/app/navigation/navigation.json) | Every category and topic, in display order |
| [`NavigationMenu.ts`](../../../../src/app/navigation/NavigationMenu.ts) | Parses and validates the JSON |
| [`FeatureRoute.ts`](../../../../src/app/navigation/FeatureRoute.ts) | `featureRoutes` |

## Ownership and selection

The screen receives a `NavigationCategory` and the selected `FeatureRoute` from `ContentView`, and is stateless. An available topic renders `LabListCard` with `to`; a planned one renders it without, which produces a `div`, so it cannot be focused or opened. The trailing icon is an SVG with `role="img"` and an `aria-label` of "Open" or "Planned".

## Current topics

| Category | Available | Planned |
| --- | --- | --- |
| TypeScript | Values & types, null & undefined, arrays/sets/maps, functions & closures, objects/classes/enums, interfaces & generics, error handling, promises & async/await, iterators & generators, strings & regex | — |
| React | Components & props, state & events, effects, lists & keys, forms, context, refs & the DOM, Suspense & lazy loading, transitions & actions, accessibility & testing | — |
| HTTP Client | fetch, axios | — |
| Security | Hide content when the page is hidden, Content Security Policy, clipboard permissions | — |
| Integration | — | Firebase |
| Others | Browser & device | — |

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| One topic is still planned (Firebase) | Its row cannot be opened | Implement topics one at a time, each with its specs |
| Planned rows give no feedback when clicked | Users may think the click failed | Accepted (CAT-AC-03) |

## Verification

- Automated: `ContentView.test.tsx` (`shows available topics as links and planned topics without one`); `NavigationMenu.test.ts` (routes, icons, unique titles).
- Manual: CAT-AC-01 to CAT-AC-03 with VoiceOver in Safari.
