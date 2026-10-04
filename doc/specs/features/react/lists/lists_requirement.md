# Feature: Lists & keys

Status: Implemented

## Goal

Show how to render arrays, why keys must identify items rather than positions, and how to filter and sort while rendering.

## Scope

### In scope

- `map` with keys from the data.
- A side-by-side comparison of index keys and id keys.
- Filtering and sorting during rendering with `toSorted`.

### Out of scope

- Virtualised lists and pagination.

## Behavior

- The first card lists four languages with their years.
- Typing a note and clicking **Add to top** shows the note moving to the new task in the `key={index}` list and staying with its task in the `key={task.id}` list. **Reset** restores both lists.
- **Filter** and **Sort by** change the language list; no match shows "No languages match …".

## UI & Navigation

- Entry point: **React** category → **Lists & keys** (`/react/reactLists`).
- An introduction and 3 cards: **Rendering an array with map**, **Keys keep each item's identity**, **Filter and sort while rendering**.
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
| LST-AC-01 | Type "first" next to Write tests in both lists, then **Add to top** | The index-keyed list shows the note on "New task 3"; the id-keyed list keeps it on "Write tests". |
| LST-AC-02 | Filter "swift" | One language is listed. |
| LST-AC-03 | Sort by Name | C is first. |

## Technical implementation constraints

- Source lives in `src/features/react/lists/`.
- Route `reactLists`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- No new dependencies.

## Related documents

- [Detailed design](lists_detail_design.md)
- [Slate design system](../../../common/theme/theme_detail_design.md)
