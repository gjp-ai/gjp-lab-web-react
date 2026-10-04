# Home page detailed design

Status: Implemented

Requirements: [Home page](home_requirement.md)

## Implementation goal

One screen, `HomeScreen`, rendered by `ContentView` at `/` in every layout, built entirely from `navigationMenu`, so it never needs editing when topics change.

## Source map

| Source | Responsibility |
| --- | --- |
| [`HomeScreen.tsx`](../../../../src/app/home/HomeScreen.tsx) | The introduction, Start here, All topics, and Tips sections |
| [`ContentView.tsx`](../../../../src/app/ContentView.tsx) | Shows the home page at `/`: alone on a phone (titled "GJP Lab", with `ColorSchemeToggle`), beside the sidebar or tree elsewhere (titled "Home") |
| [`navigation.json`](../../../../src/app/navigation/navigation.json) and [`NavigationMenu.ts`](../../../../src/app/navigation/NavigationMenu.ts) | `featured` (validated by `parseNavigationMenu`) and `findCategoryOfRoute` |

## Layout

| Layout | At `/` |
| --- | --- |
| `single` | Home page only |
| `two` | Category sidebar │ Home |
| `three` | Category sidebar │ Home (spanning the catalogue and feature columns) |
| `sidebar` | Tree │ Home (content up to 1120 px) |

The screen root is a CSS container: Start here uses one, two (`@lg`), or three (`@4xl`) columns, and All topics one or two (`@2xl`).

## Ownership and state

- No state: everything is read from `navigationMenu` while rendering.
- Each address is `BASE_URL` plus the router path, so it includes `/lab/react/` and works when pasted.
- The category link keeps the sidebar's accessible name ("<Category>: <summary>. Opens the <Category> catalogue").

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Addresses are paths, not full URLs | A copied address needs the host added | Add a copy button that builds the full URL in a repository (clipboard access) |

## Verification

- Automated: `HomeScreen.test.tsx` (counts, featured links and addresses, every category and its topics, planned names); `ContentView.test.tsx` (home on a phone with the toggle, beside the sidebar and the tree); `NavigationMenu.test.ts` (featured routes are listed topics).
- Manual: HOM-AC-01 to HOM-AC-05 at 375, 1000, and 1400 px, in light and dark mode, keyboard only.
