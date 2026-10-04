# Transitions & actions detailed design

Status: Implemented, with known gaps

Requirements: [Transitions & actions](transitions_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`TransitionsScreen.tsx`](../../../../../src/features/react/transitions/TransitionsScreen.tsx) | Screen, `SlowList` (memoised), `SlowItem`, and the three demos |
| [`projectRepository.ts`](../../../../../src/features/react/transitions/projectRepository.ts) | Simulated `saveProjectName` and `sendMessage`, and the package names |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactTransitions` |

## Ownership and state

- The filter demo keeps the typed query (urgent) and the applied filter (transition) separately; `SlowList` is wrapped in `memo` so typing alone does not render it.
- `useActionState` holds `{ saved, draft, error }`; the field is keyed on it and uses `draft` as its default, so it shows the right text after each result.
- `useOptimistic` adds a pending message; React drops it when the action ends, by which time the real list has the sent message.
- `latencyMs` (default 1200) and `slowItemMs` (default 1) are props only tests set to 0.

## Deliberate slowness

`SlowItem` busy-waits in `blockMainThread` to make the transition visible. It is the only intentionally blocking code in the app and must not be copied.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The slowness depends on the device | Fast machines show a smaller difference | Raise `slowItemMs` if the demo looks the same |

## Verification

- Automated: `TransitionsScreen.test.tsx` (transition filter, action result and error, optimistic send and rollback); `projectRepository.test.ts`.
- Manual: TRN-AC-01 to TRN-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
