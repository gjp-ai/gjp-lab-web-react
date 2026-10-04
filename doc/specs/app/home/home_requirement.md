# Feature: Home page

Status: Implemented

## Goal

Introduce GJP Lab to a first-time visitor and give everyone quick links into the topics, so the site's front door explains what it is and gets readers to a demo in one click.

## Scope

### In scope

- An introduction with counts of available and planned topics and categories.
- **Start here**: quick links to featured topics, each with its shareable address.
- **All topics**: every category with links to its available topics and the names of planned ones.
- Short tips on using the site.

### Out of scope

- Search, recently visited topics, and favourites.
- News or a changelog.

## Behavior

- The home page is the screen at `/` (the site's `/lab/react/`), in every layout. On a phone it is the first screen, titled "GJP Lab" with the light and dark toggle; a category's Back link returns to it. On wider windows it fills the space beside the sidebar or tree, titled "Home".
- Quick links open their topic; on a desktop the tree opens that topic's category and marks the topic.
- The counts, featured topics, categories, and topics all come from `navigation.json`, so they change when a topic is added or released.

## UI & Navigation

- An introduction card: the heading "Learn the web platform by running it", a paragraph about the lab, and three figures (topics to try, planned, categories).
- **Start here**: one card per featured topic with its category, title, description, and address (for example `/lab/react/httpClient/fetch`), in one to three columns depending on the pane width.
- **All topics**: one card per category with its icon, title, and summary (a link to its catalogue), its available topics as links, and "Also planned:" or "Coming soon:" with the planned topic names; one or two columns.
- **Tips**: addresses can be shared, topics show their code, the theme toggle, and the `[` shortcut on desktops.
- Real headings and lists; every link has a visible name; light and dark mode, text zoom, and phone width.

## Rules & Constraints

- The featured topics are the `featured` list in `navigation.json`; each must be a route listed in a category, or parsing fails.
- Addresses are built from `import.meta.env.BASE_URL`, never a hard-coded path.

## Platform limitations

- None.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| HOM-AC-01 | Open `/lab/react/` on a phone | The home page titled "GJP Lab", with the theme toggle. |
| HOM-AC-02 | Open it on a desktop | The tree beside a "Home" pane. |
| HOM-AC-03 | Choose **axios** under Start here | The axios topic opens; on a desktop the tree opens HTTP Client and marks axios. |
| HOM-AC-04 | Read the counts | They match the available and planned topics in `navigation.json`. |
| HOM-AC-05 | Open a category from All topics on a phone, then Back | The home page again. |

## Technical implementation constraints

- Source lives in `src/app/home/`; `ContentView` shows it at `/`.
- No new dependencies.

## Related documents

- [Detailed design](home_detail_design.md)
- [Sidebar requirement](../navigation/sidebar_requirement.md)
