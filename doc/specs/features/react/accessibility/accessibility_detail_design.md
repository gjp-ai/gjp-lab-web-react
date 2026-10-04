# Accessibility & testing detailed design

Status: Implemented, with known gaps

Requirements: [Accessibility & testing](accessibility_requirement.md)

## Implementation goal

One `LabDemoPage` with 4 `LabDemoSection` cards, one per technique. The demo components are private to the screen file.

## Source map

| Source | Responsibility |
| --- | --- |
| [`AccessibilityScreen.tsx`](../../../../../src/features/react/accessibility/AccessibilityScreen.tsx) | Screen, `Disclosure`, and the four demos |
| [`AccessibilityScreen.test.tsx`](../../../../../src/features/react/accessibility/AccessibilityScreen.test.tsx) | The test that runs in CI and is shown on the page through a `?raw` import |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactAccessibility` |

## Ownership and state

- Each demo owns its counters with `useState`; `Disclosure` owns its open state and uses `useId` for `aria-controls`.
- The status region is rendered empty from the start, because screen readers only announce changes in regions already on the page.

## Deliberate fault

The `<div onClick>` Save is inaccessible on purpose and is labelled "avoid". It is the only such control in the app.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Screen-reader output is checked by hand only | Announcements are not covered by tests | Keep the manual check in the acceptance criteria |

## Verification

- Automated: `AccessibilityScreen.test.tsx` (keyboard reach, disclosure state, live region).
- Manual: A11Y-AC-01 to A11Y-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
