# Feature: Accessibility & testing

Status: Implemented

## Goal

Show that accessible React starts with semantic HTML, uses ARIA for state HTML cannot express, announces changes, and is tested by role and name.

## Scope

### In scope

- A `<button>` compared with a `<div onClick>`.
- A disclosure with `aria-expanded` and `aria-controls`.
- A `role="status"` live region.
- The screen's own Testing Library test, shown on the page.

### Out of scope

- Automated accessibility audits (axe) and focus traps.

## Behavior

- The real **Save** button is reachable with Tab and works with Enter and Space; the div version works only with a mouse.
- Each question opens and closes its answer and reports the state with `aria-expanded`.
- **Add to basket** updates the count and puts "Added to basket. N items in total." in the status region.
- The last card shows the source of `AccessibilityScreen.test.tsx`.

## UI & Navigation

- Entry point: **React** category → **Accessibility & testing** (`/react/reactAccessibility`).
- An introduction and 4 cards: **Semantic HTML first**, **State that HTML cannot express**, **Announce changes with a live region**, **Test the way people use it**.
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
| A11Y-AC-01 | Tab to the first Save and press Enter | "Pressed 1 times" under the button. |
| A11Y-AC-02 | Open "What does aria-expanded add?" | The answer shows and the button reports expanded. |
| A11Y-AC-03 | Click **Add to basket** with a screen reader on | "Added to basket. 1 item in total." is announced without moving focus. |

## Technical implementation constraints

- Source lives in `src/features/react/accessibility/`.
- Route `reactAccessibility`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](accessibility_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
