# Refs & the DOM detailed design

Status: Implemented, with known gaps

Requirements: [Refs & the DOM](refs_requirement.md)

## Implementation goal

One `LabDemoPage` with 4 `LabDemoSection` cards, one per technique. The demo components are private to the screen file.

## Source map

| Source | Responsibility |
| --- | --- |
| [`RefsScreen.tsx`](../../../../../src/features/react/refs/RefsScreen.tsx) | Screen, `SearchField` (ref as a prop), and the four demos |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactRefs` |

## Ownership and state

- The stopwatch keeps start time and now in state (shown) and the interval id in a ref (not shown); an effect cleanup clears the interval on unmount.
- The scroll demo keeps a `Map` of row elements in one ref, filled by ref callbacks that return a cleanup, and the typed row as text so partial input is not clamped while typing.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Measurement is on demand | Resizing the window does not update the numbers | Add a `ResizeObserver` in an effect |

## Verification

- Automated: `RefsScreen.test.tsx` (focus, stopwatch, measure with a mocked rectangle, scroll with a recorded `scrollIntoView`).
- Manual: REF-AC-01 to REF-AC-04 with the keyboard, in light and dark mode, at phone and desktop widths.
