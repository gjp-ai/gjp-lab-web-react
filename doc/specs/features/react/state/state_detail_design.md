# State & events detailed design

Status: Implemented

Requirements: [State & events](state_requirement.md)

## Implementation goal

One `LabDemoPage` with 4 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`StateScreen.tsx`](../../../../../src/features/react/state/StateScreen.tsx) | Screen and the four demo components |
| [`temperature.ts`](../../../../../src/features/react/state/temperature.ts) | Celsius and Fahrenheit conversion and formatting |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactState` |

## Ownership and state

- Each demo component owns its own `useState`; values reset when the topic is reopened.
- `TemperatureDemo` stores one number in Celsius. Each `TemperatureInput` keeps a text draft while focused, so partial input such as "-" or "3." is not replaced, and reports a number only when the text parses.

## Event log keys

The event log is append-only, so its rows use the index as key; the Lists & keys topic explains when that is unsafe.

## Known gaps

None known.

## Verification

- Automated: `StateScreen.test.tsx` (updater, object state, propagation, lifted state); `temperature.test.ts`.
- Manual: STE-AC-01 to STE-AC-04 with the keyboard, in light and dark mode, at phone and desktop widths.
