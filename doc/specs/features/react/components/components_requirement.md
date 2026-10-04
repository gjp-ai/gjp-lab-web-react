# Feature: Components & props

Status: Implemented

## Goal

Show how React builds a page from components that take props, wrap children, and decide what to render, so a reader understands how data flows down and the UI updates.

## Scope

### In scope

- A component with a required prop and an optional prop with a default.
- Composition with `children`.
- Conditional rendering: returning `null`, `&&`, and a ternary.

### Out of scope

- State management beyond `useState` (see [State & events](../state/state_requirement.md)).
- Effects, context, and refs (see [Effects](../effects/effects_requirement.md), [Context](../context/context_requirement.md), and [Refs & the DOM](../refs/refs_requirement.md)).

## Behavior

- Typing a name updates both greetings immediately; an empty name shows "stranger".
- The tone button switches the callout between plain and strong styles.
- **New message** increases the unread count; **Mark all read** sets it to zero, which hides the badge and the button.

## UI & Navigation

- Entry point: **React** category → **Components & props** (`/react/reactComponents`).
- An introduction and three cards: **Components and props**, **Children and composition**, **Conditional rendering**.
- Every control is keyboard-reachable and labelled; light and dark mode and text zoom are supported.

## Rules & Constraints

- Function components only, with typed props.
- Colours come from the Slate tokens; main actions use `LabButton`.
- Nothing is persisted, sent, or logged.

## Platform limitations

- None.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| CMP-AC-01 | Type "Lin" in Name | Both greetings read Lin, one with "!" and one with "?". |
| CMP-AC-02 | Click **Use strong tone** | The callout switches to `primary` with `on-primary` text. |
| CMP-AC-03 | Click **Mark all read** | The badge and the button disappear; the text reads "All caught up." |
| CMP-AC-04 | Screen reader on the badge | It is read as "3 unread". |

## Technical implementation constraints

- Source lives in `src/features/react/components/`.
- Route `reactComponents`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](components_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
