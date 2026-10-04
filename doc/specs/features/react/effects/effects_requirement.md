# Feature: Effects

Status: Implemented

## Goal

Show when React runs an effect and its cleanup, how dependencies control it, and when a value should be calculated during rendering instead.

## Scope

### In scope

- Setup and cleanup of an interval.
- An effect that re-runs when a dependency changes, with cleanup cancelling stale work.
- Calculating derived values during rendering.

### Out of scope

- Data fetching libraries and `use` (see Suspense & lazy loading).
- `useLayoutEffect` and custom hooks.

## Behavior

- **Show ticker** mounts a ticker that counts seconds; **Remove ticker** unmounts it. The effect log shows "setup" and "cleanup" lines (in development, Strict Mode adds one extra cleanup and setup on mount).
- Typing in **Search fruit** waits 400 ms after the last keystroke, then shows the matching fruit and logs the search.
- Editing the names updates the initials immediately.

## UI & Navigation

- Entry point: **React** category → **Effects** (`/react/reactEffects`).
- An introduction and 3 cards: **Setup and cleanup**, **Dependencies decide when it runs**, **You might not need an effect**.
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
| EFF-AC-01 | Show, then remove the ticker | The log shows "setup: interval started", then "cleanup: interval cleared". |
| EFF-AC-02 | Type "berry" quickly | One search runs: "1 found: Blueberry". |
| EFF-AC-03 | Change First name to Mary | Initials read MJ. |

## Technical implementation constraints

- Source lives in `src/features/react/effects/`.
- Route `reactEffects`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](effects_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
