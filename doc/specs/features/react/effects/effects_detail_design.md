# Effects detailed design

Status: Implemented, with known gaps

Requirements: [Effects](effects_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`EffectsScreen.tsx`](../../../../../src/features/react/effects/EffectsScreen.tsx) | Screen, `Ticker`, the search and derived-value demos, and `EffectLog` |
| [`fruitSearch.ts`](../../../../../src/features/react/effects/fruitSearch.ts) | Case-insensitive fruit search over a fixed list |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactEffects` |

## Ownership and state

- `TimerDemo` owns the log and passes a `useCallback` logger, so the ticker effect does not re-run when the parent renders.
- `SearchDemo` keeps the query and results; its effect depends on `[query, delayMs]` and clears its timeout in cleanup.
- `searchDelayMs` (default 400) is a prop only tests set to 0.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The log keeps only the last six entries | Older lines disappear | Intended; keeps the card short |

## Verification

- Automated: `EffectsScreen.test.tsx` (setup and cleanup, dependency re-run, derived value); `fruitSearch.test.ts`.
- Manual: EFF-AC-01 to EFF-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
