# Feature: Context

Status: Implemented

## Goal

Show how context passes a value to deep components without props, how providers nest, and how to share state and updates through context.

## Scope

### In scope

- `createContext`, `<Context value>` as provider (React 19), and `use(Context)`.
- Nested providers and the default value.
- A provider that shares state and functions, with a hook that checks for the provider.

### Out of scope

- State libraries and reducers.
- Performance tuning of context updates.

## Behavior

- **Use miles** / **Use kilometres** switches every run card between km and mi.
- The nested-provider card shows 10.0 km without a provider, 6.2 mi inside the imperial provider, and 10.0 km inside the inner metric one.
- **Add** on any product increases the cart count; **Empty cart** (disabled at zero) resets it.

## UI & Navigation

- Entry point: **React** category → **Context** (`/react/reactContext`).
- An introduction and 3 cards: **Providing and reading a value**, **The nearest provider wins**, **Sharing state and updates**.
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
| CTX-AC-01 | Click **Use miles** | The marathon reads 26.2 mi. |
| CTX-AC-02 | Read the nested-provider card | 10.0 km, 6.2 mi, 10.0 km. |
| CTX-AC-03 | Add two products, then empty the cart | "Cart: 2 items", then "Cart: 0 items". |

## Technical implementation constraints

- Source lives in `src/features/react/context/`.
- Route `reactContext`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](context_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
