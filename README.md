# GJPLab Web Feature Lab

GJPLab is a small React app for learning TypeScript, React, and the web platform by reading, running, and extending self-contained working features. Each feature is a short, readable slice of real code with a matching requirement and design document. It is the web counterpart of the iOS lab (`gjp-lab-ios-swift`) and the Android lab (`gjp-lab-android-kotlin`), and shares their folder structure and names.

## Features

A sidebar lists the categories; each category's catalogue marks topics as available (chevron) or planned (clock). On windows 1200 px and wider the sidebar, catalogue, and feature sit side by side; from 840 px two panes are shown; on phones they collapse into one stack. The URL always names the current screen, so any topic can be linked and the browser's Back button moves up one level.

| Category | Available | Planned |
| --- | --- | --- |
| TypeScript | All ten topics, each a set of runnable samples that show real output: values & types, null & undefined, arrays/sets/maps, functions & closures, objects/classes/enums, interfaces & generics, error handling, promises & async/await, iterators & generators, strings & regex | — |
| React | All ten topics, each with live demos: components & props, state & events, effects, lists & keys, forms, context, refs & the DOM, Suspense & lazy loading, transitions & actions, accessibility & testing | — |
| HTTP Client | **fetch** and **axios**: build and send a request to seven example APIs, inspect status, time, size, body, and headers, and read the code; axios adds a comparison with fetch | — |
| Security | — | Hide content when the page is hidden, Content Security Policy, clipboard permissions |
| Integration | — | Firebase |
| Others | **Browser & device**: browser, language, screen, pixel ratio, CPU, and memory | — |

App-wide behaviour: a maintenance mode read from a JSON file at startup, and a Slate light/dark design system.

## Requirements

- Node.js 22.22 or later (React Router 8 requires it; developed with Node 24) and npm
- A current Chrome, Edge, Firefox, or Safari

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173/lab/react/
```

Other commands:

```bash
npm test        # Vitest unit and component tests
npm run lint    # oxlint
npm run build   # type-check and production build in dist/
```

## Deployment

The app is served from `/lab/react/` (the `base` in `vite.config.ts`). Copy `dist/` to that path, and have the web server answer any URL below it that is not a file with `/lab/react/index.html`, so links such as `/lab/react/httpClient/fetch` work after a reload. For example, with nginx:

```nginx
location /lab/react/ {
    try_files $uri /lab/react/index.html;
}
```

Maintenance mode is read from `public/remote-config.json` (`{ "maintenanceEnabled": false }`). To read it from a server instead, copy `.env.example` to `.env.local` and set `VITE_REMOTE_CONFIG_URL`.

## Project structure

```
src/
├── app/          App (startup), ContentView (routes and panes), FeatureDestination;
│                 startup/ (maintenance), navigation/ (navigation.json, sidebar, catalogue)
├── features/     <category>/<feature>/, one flat folder per feature, tests alongside
├── common/       config/, theme/ (Slate tokens, LabButton, LabDemoPage), codesample/
└── test/         test setup
public/           favicon and remote-config.json
doc/              architecture/, decisions/, templates/, and specs/ (mirrors src/)
```

## Documentation

Start with the [documentation index](doc/README.md). Project-wide docs live in `doc/architecture/`; each screen's requirement and detailed design live in `doc/specs/` at the same path as its code, for example [`doc/specs/features/httpclient/fetch/`](doc/specs/features/httpclient/fetch/).

## Working with coding agents

[`AGENTS.md`](AGENTS.md) holds the project rules, commands, and conventions. Codex and other agents read it directly; [`CLAUDE.md`](CLAUDE.md) imports it for Claude Code.
