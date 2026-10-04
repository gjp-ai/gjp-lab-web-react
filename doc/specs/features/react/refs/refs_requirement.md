# Feature: Refs & the DOM

Status: Implemented

## Goal

Show how refs reach DOM elements to focus, measure, and scroll them, and how they hold values that should not cause a render.

## Scope

### In scope

- `useRef` for an element and `ref` as a prop (React 19).
- A ref holding an interval id.
- Measuring with `getBoundingClientRect`.
- Ref callbacks with cleanup for many elements.

### Out of scope

- `useImperativeHandle` and third-party DOM libraries.

## Behavior

- **Focus the field** focuses the search field; **Select its text** selects it.
- **Start** runs a stopwatch, **Stop** stops it, and **Restart** starts again from zero. Leaving the topic stops the timer.
- **Measure** shows the box size; changing the width clears the measurement.
- **Scroll to row** scrolls the list to the typed row (clamped to 1–40) and highlights it.

## UI & Navigation

- Entry point: **React** category → **Refs & the DOM** (`/react/reactRefs`).
- An introduction and 4 cards: **Focus an element**, **Remember a value without rendering**, **Measure an element**, **Refs to many elements**.
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
| REF-AC-01 | Click **Focus the field** | The search field has focus. |
| REF-AC-02 | Start, then stop the stopwatch | The time stops and the first button reads Restart. |
| REF-AC-03 | Choose full width and **Measure** | The status shows the box width and height in pixels. |
| REF-AC-04 | Type 33 and **Scroll to row** | Row 33 scrolls into view. |

## Technical implementation constraints

- Source lives in `src/features/react/refs/`.
- Route `reactRefs`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](refs_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
