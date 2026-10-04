# Context detailed design

Status: Implemented, with known gaps

Requirements: [Context](context_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ContextScreen.tsx`](../../../../../src/features/react/context/ContextScreen.tsx) | Screen, `UnitsContext`, `CartContext`, `CartProvider`, and `useCart` |
| [`units.ts`](../../../../../src/features/react/context/units.ts) | `formatDistance` in kilometres or miles |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactContext` |

## Ownership and state

- `ProviderDemo` owns the units with `useState` and provides them; `RunList` in between takes no props.
- `CartProvider` owns the count and provides `{ count, add, clear }`; `useCart` throws if used outside it.
- The contexts are private to the screen, so they do not become an app-wide store.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The cart value is a new object on every render | Every cart consumer renders again when the provider renders | Acceptable at this size; `useMemo` if it grows |

## Verification

- Automated: `ContextScreen.test.tsx` (provider, nesting and default, shared cart); `units.test.ts`.
- Manual: CTX-AC-01 to CTX-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
