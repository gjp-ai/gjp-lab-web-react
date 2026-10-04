# Feature: Transitions & actions

Status: Implemented

## Goal

Show how transitions keep the page responsive during slow updates, and how actions report pending state, results, and optimistic updates.

## Scope

### In scope

- `useTransition` with a deliberately slow list, compared with a direct update.
- `useActionState` with a form.
- `useOptimistic` with rollback on failure.

### Out of scope

- `useDeferredValue` and server actions.
- Real network requests.

## Behavior

- Typing in **Filter packages** updates the field at once; the list follows, dimmed with "Updating the list…" while pending. Unticking **Filter in a transition** makes each keystroke wait for the list.
- **Rename** shows "Saving…", then the saved name; a name under 3 characters shows an error and keeps the typed text.
- **Send** shows the message at once with "Sending…"; it stays when sent, and disappears with an error when the text contains "fail".

## UI & Navigation

- Entry point: **React** category → **Transitions & actions** (`/react/reactTransitions`).
- An introduction and 3 cards: **useTransition keeps typing responsive**, **useActionState for a form's result**, **useOptimistic shows the result before the server answers**.
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
| TRN-AC-01 | Type "12" in the filter | The field updates at once; the list then shows 13 packages. |
| TRN-AC-02 | Rename to "ab" | "A project name needs at least 3 characters." and the field still reads ab. |
| TRN-AC-03 | Send "this will fail" | The message shows as sending, then disappears with "could not be sent". |

## Technical implementation constraints

- Source lives in `src/features/react/transitions/`.
- Route `reactTransitions`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](transitions_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
