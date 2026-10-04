# Feature: Forms

Status: Implemented

## Goal

Show controlled inputs, accessible validation messages, and React 19 form actions, so a reader can choose between controlled and uncontrolled forms.

## Scope

### In scope

- Controlled text, select, radio, and checkbox inputs.
- Validation on blur and submit, linked with `aria-describedby` and `aria-invalid`, with focus moved to the first error.
- `<form action>` with `FormData` and `useFormStatus`.

### Out of scope

- `useActionState` and `useOptimistic` (see Transitions & actions).
- Sending data to a real server.

## Behavior

- Changing any control in **Controlled inputs** updates the state summary.
- **Create account** with errors shows a message under each invalid field and focuses the first one; valid values show "Account created for …" and clear the form.
- **Send feedback** shows "Sending…" for 1.2 s, then "<Topic> received as ticket FB-0001." and clears the message; an empty message shows "Write a message before sending."

## UI & Navigation

- Entry point: **React** category → **Forms** (`/react/reactForms`).
- An introduction and 3 cards: **Controlled inputs**, **Validation messages**, **Form actions**.
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
| FRM-AC-01 | Type Lin, choose Enterprise, L, and untick news | The summary reads Lin, enterprise, L, false. |
| FRM-AC-02 | Submit an empty sign-up form | Email is focused, marked invalid, and described by "Enter your email address." |
| FRM-AC-03 | Send a Bug report with a message | The button reads "Sending…", then a ticket number appears and the message clears. |

## Technical implementation constraints

- Source lives in `src/features/react/forms/`.
- Route `reactForms`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](forms_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
