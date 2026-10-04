# 0001: One flat folder per feature and per app area, mirroring the iOS lab

Status: Accepted, 2026-10-04

## Context

The first plan for this project (in an earlier `CLAUDE.md`) used `src/labs/<category>/<slug>/` with a central `registry.ts`, shared code split between `components/` and `lib/`, and categories of its own (`react-core`, `state`, `sdk`, …). The iOS and Android labs had already settled on a different shape, with matching folders, type names, and specs. A reader moving between the three labs would have had to learn a second layout for the same ideas.

## Decision

- `src/` has three areas, as in the iOS lab: `app/` (startup and navigation), `common/` (shared config, theme, and code sample), and `features/<category>/<feature>/`.
- Each feature and each app area (`app/startup/`, `app/navigation/`) is one flat folder holding its screens, repositories, models, and tests. Do not create subfolders by file type. If a feature grows large, split it by sub-feature (for example `fetch/history/`).
- Files with an iOS counterpart use the iOS name (`ContentView`, `CategorySidebar`, `FeatureCatalogScreen`, `NavigationMenu`, `FeatureRoute`, `LabDemoSection`). Web-only pieces keep web names (`paneLayout`, `FeatureDestination`).
- `doc/specs/` mirrors `src/`: docs for `src/<path>/` live in `doc/specs/<path>/`.
- Categories mirror the iOS ones: TypeScript (the language, like Swift), React (the UI framework, like SwiftUI), HTTP Client, Security, Integration, and Others.

## Consequences

- One folder shows everything a feature needs, including its tests, and the same path finds its docs in all three labs.
- `AGENTS.md` replaces the old `CLAUDE.md` plan; `CLAUDE.md` now imports `AGENTS.md`.
- Tests sit next to the code (`*.test.ts(x)`), the web convention, rather than in separate test targets.

Related: iOS decision 0002 and Android decision 0001 make the same choice.
