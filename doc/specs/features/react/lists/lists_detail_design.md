# Lists & keys detailed design

Status: Implemented

Requirements: [Lists & keys](lists_requirement.md)

## Implementation goal

One `LabDemoPage` with 3 `LabDemoSection` cards, one per technique. The demo components are private to the screen file, and pure logic lives in its own module so it can be unit-tested.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ListsScreen.tsx`](../../../../../src/features/react/lists/ListsScreen.tsx) | Screen and the three demos, including `TaskList` |
| [`languages.ts`](../../../../../src/features/react/lists/languages.ts) | The language data and `visibleLanguages` (filter and sort without changing the input) |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `reactLists` |

## Ownership and state

- `KeysDemo` owns the task list and the next id; both lists render the same array with different keys.
- The note fields are uncontrolled, so their text lives in the DOM element React keeps or reuses by key; that is what makes the difference visible.
- `DerivedListDemo` stores only the query and sort; the visible list is calculated on every render.

## Known gaps

None known.

## Verification

- Automated: `ListsScreen.test.tsx` (key comparison, filter, sort, empty state); `languages.test.ts`.
- Manual: LST-AC-01 to LST-AC-03 with the keyboard, in light and dark mode, at phone and desktop widths.
