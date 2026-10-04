# Feature: Suspense & lazy loading

Status: Implemented

## Goal

Show how Suspense shows a fallback while code or data loads, and how a transition keeps the old content instead.

## Scope

### In scope

- `lazy` with a dynamic `import()` behind a Suspense boundary.
- `use(promise)` with a promise kept in state.
- Setting a new promise inside `startTransition`.

### Out of scope

- Error boundaries and server rendering.
- Real network requests.

## Behavior

- **Show timeline** shows "Loading the timeline code…" for about a second the first time, then a chart of React major releases; **Hide timeline** hides it.
- The data card loads React 19 notes on open, showing "Loading release notes…"; **React 18** or **React 19** shows the fallback again, then the notes.
- The transition card keeps the current notes on screen, dimmed, while the new ones load.

## UI & Navigation

- Entry point: **React** category → **Suspense & lazy loading** (`/react/reactSuspense`).
- An introduction and 3 cards: **Lazy-loaded components**, **Waiting for data with use()**, **Keep showing the old content**.
- Every control is keyboard-reachable and labelled; light and dark mode, text zoom, and phone width are supported.

## Rules & Constraints

- Function components only, with typed props; main actions use `LabButton`, fields use `labInputClassName`.
- Colours come from the Slate tokens.
- Nothing is persisted, sent over the network, or logged; any server is simulated in the feature folder.

## Platform limitations

- None.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| SUS-AC-01 | Click **Show timeline** | A fallback, then the timeline from 0.3 (2013) to 19 (2024). |
| SUS-AC-02 | Click **React 18** in the data card | The fallback, then March 2022 notes. |
| SUS-AC-03 | Click **React 19** in the transition card | The old notes stay dimmed, then December 2024 notes appear without the fallback. |

## Technical implementation constraints

- Source lives in `src/features/react/suspense/`.
- Route `reactSuspense`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](suspense_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
