# Suspense & lazy loading detailed design

Status: Implemented, with known gaps

Requirements: [Suspense & lazy loading](suspense_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`SuspenseScreen.tsx`](../../../../../src/features/react/suspense/SuspenseScreen.tsx) | Screen, the three demos, `ReleaseCard`, and `Fallback` |
| [`ReleaseTimeline.tsx`](../../../../../src/features/react/suspense/ReleaseTimeline.tsx) | The lazily loaded chart (its own chunk) |
| [`releaseRepository.ts`](../../../../../src/features/react/suspense/releaseRepository.ts) | `loadReleaseNotes`, bundled notes returned after a delay |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactSuspense` |

## Ownership and state

- Each data demo keeps the current promise in `useState` and replaces it in the button handler; promises are never created while rendering.
- The `lazy` component is created once per screen in a `useState` initializer, so the demo delay can come from props.
- `latencyMs` (default 1000) is a prop only tests set to 0.

## Testing note

A component that calls `use` suspends while rendering, so tests wrap the first render and promise-changing clicks in an awaited `act()`.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| No error boundary | A rejected promise would reach the app root | Add an error boundary demo when a class-component exception is approved |

## Verification

- Automated: `SuspenseScreen.test.tsx` (lazy component, `use` with a changing promise, transition).
- Manual: SUS-AC-01 to SUS-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
