# Forms detailed design

Status: Implemented, with known gaps

Requirements: [Forms](forms_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`FormsScreen.tsx`](../../../../../src/features/react/forms/FormsScreen.tsx) | Screen, `ValidatedField`, and `SendButton` |
| [`signUpValidation.ts`](../../../../../src/features/react/forms/signUpValidation.ts) | `validateSignUp`, the pure validation rules |
| [`feedbackRepository.ts`](../../../../../src/features/react/forms/feedbackRepository.ts) | `sendFeedback`, a simulated server with a delay |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactForms` |

## Ownership and state

- The controlled and validation demos own their values with `useState`; errors are calculated from the values on every render, and `touched` decides which to show.
- The action demo keeps no field state: React passes the `FormData` to the action and resets the uncontrolled fields after it finishes.
- `latencyMs` (default 1200) is a prop only tests set to 0. Nothing leaves the browser.

## Accessibility

Each field links its hint and error with `useId` and `aria-describedby`. The form uses `noValidate`, so the browser's own bubbles do not compete with the messages. Results are in `role="status"` regions.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Feedback tickets are numbered per page load | Numbers restart after a reload | Intended for a simulation |

## Verification

- Automated: `FormsScreen.test.tsx` (controlled summary, validation and focus, form action and reset); `signUpValidation.test.ts`.
- Manual: FRM-AC-01 to FRM-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
