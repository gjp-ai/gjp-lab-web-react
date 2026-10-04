# Feature: Category sidebar

Status: Implemented

## Goal

Give users one starting point that lists every lab category, and leads to its topics with the layout that suits the window: side by side on wide screens, one step at a time on phones.

## Scope

### In scope

- The first pane: the category list and selection.
- How categories, catalogue, and feature are arranged at each window width.
- URLs for every level, and browser Back between them.

### Out of scope

- The catalogue's contents (see the [catalogue requirement](catalog_requirement.md)) and the feature screens.
- Search, favourites, and recently used items.

## Behavior

- Every level has a URL: `/` (categories), `/<category>`, `/<category>/<topic route>`, and `/<category>/<topic route>/response` for a pushed screen. Reloading or sharing a URL opens the same screen.
- **840 px and wider with a mouse or trackpad (desktop):** a tree sidebar beside the content. Each category is a group that opens and closes, with its topics listed under it; the selected category opens on its own. The content shows the feature, the catalogue at `/<category>`, or "Choose a topic" at `/`.
- **1200 px and wider on a touch screen:** categories, catalogue, and feature side by side; empty panes say "Choose a category" or "Choose a topic".
- **840 px to under 1200 px on a touch screen:** two panes: categories, or the catalogue with a back link, then the feature.
- **Under 840 px, any pointer:** one level at a time with a back link; the browser's Back button also moves up.
- An unknown category or topic in the URL falls back to the nearest valid level.
- Categories appear in this order: TypeScript, React, HTTP Client, Security, Integration, Others.

## UI & Navigation

- Pane title "GJP Lab".
- Each row is its own card: the category icon in a tinted tile, the title, and a summary. The selected category has a thicker `primary` border and `aria-current="page"`.
- Each row is one link whose accessible name includes the title, summary, and "Opens the … catalogue".
- Supports light and dark mode, text zoom, and keyboard navigation.

## Rules & Constraints

- Category text and icons come from `navigation.json`; the sidebar does not hard-code them.
- Layout depends on the window width and the primary pointer (CSS media features), never on the user agent.

## Platform limitations

- Window width changes with resizing, zoom, and split-screen, so the layout can change while the page is open; the URL and selection stay the same.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| SDB-AC-01 | Open `/` | All six categories are listed in order. |
| SDB-AC-02 | Phone width: open a category, then a topic, then press Back twice | Catalogue, feature, then back to the catalogue and the categories. |
| SDB-AC-03 | Wide window: select a category and a topic | Three panes; both selections are outlined. |
| SDB-AC-04 | Reload a topic URL | The same topic opens after the splash. |
| SDB-AC-05 | Open `/typescript/notATopic` | The TypeScript catalogue opens. |
| SDB-AC-06 | Keyboard only | Tab reaches every row, and Enter opens it. |
| SDB-AC-07 | Desktop browser at 1400 px: open a topic, then open and close another category | A tree sidebar and the feature; the selected topic is marked, and groups open and close with `aria-expanded`. |

## Technical implementation constraints

- Source lives in `src/app/navigation/` and `src/app/ContentView.tsx`.
- React Router owns the selection; `ContentView` reads it with `useParams`.
- Adding a category means adding it to `navigation.json`.

## Related documents

- [Detailed design](sidebar_detail_design.md)
- [Catalogue requirement](catalog_requirement.md)
- [Decision 0003: URL-driven adaptive panes](../../../decisions/0003-url-driven-adaptive-panes.md)
