# Feature: State & events

Status: Implemented

## Goal

Show how state makes a component remember values between renders, how event handlers change it, and how a parent shares state between children, so a reader can predict when React renders again.

## Scope

### In scope

- `useState` with a value and with an updater function.
- Replacing an object in state with spread syntax.
- Event bubbling and `stopPropagation`.
- Lifting state up into a common parent.

### Out of scope

- Effects (see Effects) and reducers.
- Forms with validation (see Forms).

## Behavior

- **+3 with value** calls `setCount(count + 1)` three times and adds 1; **+3 with updater** adds 3; **Reset** sets 0.
- Editing either name field replaces the person object; the state is shown as JSON.
- **Click me** logs the button, then the card, unless **Stop propagation in the button** is ticked. **Clear** empties the log.
- Typing in Celsius or Fahrenheit updates the other field and a sentence about water.

## UI & Navigation

- Entry point: **React** category → **State & events** (`/react/reactState`).
- An introduction and 4 cards: **useState and updater functions**, **Objects are replaced, not changed**, **Events bubble up**, **Lifting state up**.
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
| STE-AC-01 | Click **+3 with value**, then **+3 with updater** | The count reads 1, then 4. |
| STE-AC-02 | Change First name to Ada | The JSON reads {"first":"Ada","last":"Hopper"}. |
| STE-AC-03 | Click **Click me** with and without stop propagation | Two log lines, then one. |
| STE-AC-04 | Type 100 in Celsius | Fahrenheit shows 212 and "Water boils at this temperature." |

## Technical implementation constraints

- Source lives in `src/features/react/state/`.
- Route `reactState`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](state_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
