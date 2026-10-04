# 0005: A tree sidebar for desktop browsers; touch screens keep the panes

Status: Accepted, 2026-10-04. Amends [0003](0003-url-driven-adaptive-panes.md).

## Context

Decision 0003 chose the layout from the window width alone, so a 1440 px desktop window showed the tablet split view: a 320 px category column and a 360 px catalogue column of large cards before the content began. That suits a finger on an iPad, but on a desktop it spends almost half the window on navigation, and moving to another category takes two clicks across two columns. Desktop users expect a docs-style sidebar instead.

## Decision

- `paneLayout(windowWidth, hasFinePointer)` adds a fourth layout, `sidebar`, used from 840 px when the primary pointer is a mouse or trackpad (`(hover: hover) and (pointer: fine)`, read by `useFinePointer`).
- The `sidebar` layout shows one 288 px `NavigationTree` (every category as a group that opens and closes, with its topics as compact links) next to the content, whose width limit rises from 720 px to 1120 px. The content pane shows the feature; at `/<category>` it shows the catalogue as an overview; at `/` it says "Choose a topic".
- The desktop sidebar collapses to a 56 px rail of category icons (header button or the `[` key). The choice is a per-browser convenience kept in local storage, not navigation state, so it never enters the URL.
- Touch screens keep the 0003 layouts: one stack below 840 px, two panes from 840 px, three from 1200 px. Every window below 840 px uses the stack, whatever the pointer.
- URLs, fallbacks, and Back behaviour are unchanged.

## Consequences

- The layout now depends on the primary pointer as well as the width. This is a CSS media feature, not user-agent sniffing, and it updates if the pointer changes.
- A touch laptop or a tablet with a trackpad reports whichever pointer the browser calls primary, so it may get either layout. Both work at every width.
- The tree's open groups are local state. The selected category opens on its own, so a reload or shared link shows the selected topic.
- Tree rows are compact links rather than `LabListCard`s, so they differ from the iOS sidebar; touch layouts still match it.

Related: the iOS lab uses `NavigationSplitView` on iPad and Mac alike; this is a web-only refinement.
