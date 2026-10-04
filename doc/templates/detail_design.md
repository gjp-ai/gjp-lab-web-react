# <Feature name> detailed design

Status: Planned | Partial | Implemented

Requirements: [<Feature name>](<feature>_requirement.md)

## Implementation goal

Describe in one or two sentences how the implementation satisfies the requirement, and the main design choice.

## Source map

| Source | Responsibility |
| --- | --- |
| [`<Feature>Screen.tsx`](<relative link>) | Screen layout, state, and user actions |
| [`FeatureRoute.ts`](<relative link>) | `<route>` in `featureRoutes` |
| [`navigation.json`](<relative link>) | Catalogue entry (`"route": "<route>"`) |

## Ownership and state

- Who owns each piece of state (URL, router state, `useState`, repository), and how long it lives.
- How the screen is reached (`/<category>/<route>`) and what it pushes (`DetailRoute`).
- Effects, cancellation (`AbortController`), and lazy loading where relevant.

## <Feature-specific section>

Add sections only where they explain something the code does not show at a glance: request flow, data sources, platform behavior, privacy and security, or stable contracts such as Firebase names. Delete this section if it is not needed.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| <What is missing or wrong> | <What the user or developer notices> | <Smallest fix> |

## Verification

- Build with the project build command in [application architecture](<relative link to doc/architecture/application.md>#build-and-verification).
- Automated: name the Vitest unit and component tests that cover this feature, or state that there are none.
- Manual: list the acceptance criteria (<PREFIX>-AC-01 …) to check, in which browsers and window widths.
