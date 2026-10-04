# Feature: Category catalogue

Status: Implemented

## Goal

Show every topic in a category, make clear which ones can be opened today, and open an implemented topic in one click.

## Scope

### In scope

- The catalogue pane for the selected category.
- A list of the category's topics with their availability.
- Opening an available topic.

### Out of scope

- The category sidebar (see the [sidebar requirement](sidebar_requirement.md)) and the feature screens.
- Search, filtering, or sorting topics.

## Behavior

- The catalogue appears for `/<category>`: beside the sidebar on wide windows, in place of it on smaller ones.
- Topics appear in the order given in `navigation.json`.
- An available topic is a link to `/<category>/<route>`; a planned topic is shown but is not a link.

## UI & Navigation

- Pane title with the category name (and a back link when the sidebar is hidden), then the category description.
- One card per topic with its title and description. Available topics end with a chevron labelled "Open"; planned topics end with a clock labelled "Planned".
- The selected topic's card has a thicker `primary` border and `aria-current="page"`.

## Rules & Constraints

- Topic text and routes come from `navigation.json`; the screen does not hard-code them.
- A topic is available only when it has a route.
- Topic titles are unique within a category; routes are unique across the menu.

## Platform limitations

None.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| CAT-AC-01 | Open HTTP Client | fetch shows a chevron and is a link; axios shows a clock and is not. |
| CAT-AC-02 | Open an available topic | Its feature opens; on a phone, Back returns to the catalogue. |
| CAT-AC-03 | Screen reader on a planned topic | Its title, description, and "Planned" are read; it is not announced as a link. |

## Technical implementation constraints

- Source lives in `src/app/navigation/`.
- Routes are checked against `featureRoutes` when `navigation.json` is parsed.

## Related documents

- [Detailed design](catalog_detail_design.md)
- [Sidebar requirement](sidebar_requirement.md)
