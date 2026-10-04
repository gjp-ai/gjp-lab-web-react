# Feature: <Feature name>

Status: Planned | Partial | Implemented

## Goal

Describe the user or product outcome in one or two sentences. State why the feature exists, not its implementation.

## Scope

### In scope

- List the observable behavior this feature must provide.

### Out of scope

- List adjacent behavior that is intentionally excluded from this requirement.

## Behavior

- Describe the trigger, the resulting behavior, and how the feature ends or recovers.
- State launch, foreground, background, error, offline, and restart behavior when relevant.
- Name any behavior that depends on system-provided information.

## UI & Navigation

- Identify the catalogue/category entry point and the destination screen.
- List required controls, status content, empty/error states, and test-only affordances.
- State accessibility, light/dark, text zoom, keyboard, and screen-width expectations where material.

## Rules & Constraints

- Record defaults, persistence, idempotency, privacy, and security rules.
- State supported browsers and the browser APIs required, with the fallback when one is missing.
- Explicitly prohibit private APIs, unsupported workarounds, credentials, or sensitive logging where applicable.

## Platform limitations

- State capabilities the OS cannot guarantee and the user-visible fallback.
- Capture browser support, permission, CORS, privacy, or service constraints.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| <PREFIX>-AC-01 | <Given/when scenario> | <Observable outcome> |

## Technical implementation constraints

- Name the feature folder (`src/features/<category>/<feature>/`) and the integration points: the route in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `src/app/navigation/navigation.json`.
- State required separation of shared, platform, data, and UI concerns.
- Forbid unrelated refactors and new dependencies unless the requirement approves them.

## Related documents

- Detailed design: `<feature>_detail_design.md` in the same folder
- Architecture or integration references: `<relative links>`
