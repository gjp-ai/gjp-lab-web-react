# AGENTS.md

## Your Role
- You are an experienced engineer specialized in TypeScript and React and familiar with the details of the web platform.
- You implement features and fix bugs.
- Your documentation and explanations are written for less experienced developers to ease understanding.

## Project Overview

GJPLab is a web lab for practising TypeScript, React, browser APIs, and third-party libraries, grouped into sidebar categories (TypeScript, React, HTTP Client, Security, Integration, Others). Its folder structure, names, and documents mirror the iOS lab (`gjp-lab-ios-swift`) and the Android lab (`gjp-lab-android-kotlin`); the implementation stays web-native.

## Tech Stack

- React 19 and TypeScript (strict) built with Vite; npm. Runtime libraries: React, React Router, and axios (pinned exactly, used only by the axios topic; see [decision 0008](doc/decisions/0008-shared-http-client-layout-and-axios.md)).
- React Router: the URL is the navigation state (`/`, `/<category>`, `/<category>/<route>`), below the deployment path `/lab/react/` (Vite `base` and the router `basename`). Never hard-code `/lab/react/`: use router paths and `import.meta.env.BASE_URL`.
- Tailwind CSS v4 with the Slate palette as theme tokens (`src/common/theme/theme.css`); no other CSS approach and no component library.
- Tests: Vitest with jsdom and Testing Library, next to the code (`*.test.ts(x)`); lint with oxlint.

## Commands

- Dev server: `npm run dev` (http://localhost:5173/lab/react/)
- Build (type-check, then bundle): `npm run build`; `npm run preview` serves the build with its Content Security Policy
- Lint: `npm run lint`
- Test: `npm test` (`npm run test:watch` while developing)

## Directory Structure

Folder names are lowercase and do not repeat their parent (`httpclient/fetch`).

| Path | Contents |
| --- | --- |
| `src/main.tsx` | Entry point: router and theme |
| `src/app/` | `App` (maintenance check, then navigation), `ContentView` (routes and panes), `FeatureDestination` (route → lazily loaded screen); `home/` holds the home page at `/`; `startup/` holds maintenance |
| `src/app/navigation/` | `navigation.json` (sidebar categories and catalogue topics), `NavigationMenu` (its parser), `FeatureRoute`, `paneLayout`, `NavigationPane`, `DesktopSidebar` and `NavigationTree` (desktop sidebar, collapsible to an icon rail), `sidebarPreference`, `CategorySidebar`, `CategoryIcon`, and `FeatureCatalogScreen`, in one flat folder |
| `src/features/<category>/<feature>/` | Screens, repositories, models, and their tests in one flat folder (no `data/` or `model/` subfolders); `src/features/httpclient/shared/` holds the page, examples, and helpers that fetch and axios share |
| `src/common/` | Shared `config/` (`AppConfig`, `preferenceStorage`, and the site's Content Security Policy), `theme/` (Slate tokens, `LabButton`, `LabListCard`, `LabDemoPage`, `LabTabs`), and `codesample/` (the runnable sample card used by the TypeScript topics) |
| `src/test/` | Test setup only |
| `public/` | Favicon and the bundled `remote-config.json` (maintenance flag) |
| `doc/` | `architecture/` for project-wide docs; `specs/` mirrors `src/` (docs for `src/<path>/` live in `doc/specs/<path>/`); `templates/` for new specs; `decisions/` for decision records (read before reversing a structural choice); `guides/` for learning material (update `guides/typescript_tutorial.md` and `guides/react_tutorial.md` when code they quote changes) |

## Architecture

- Flow: `App` reads the maintenance flag (no splash) → maintenance or `ContentView` → home page (with the sidebar on wide windows) → catalogue → feature.
- `ContentView` reads the selection from the URL and picks a layout with `paneLayout`: one stack below 840 px; from 840 px, a tree sidebar beside the content when the primary pointer is a mouse, otherwise two panes (three from 1200 px). Do not keep navigation state anywhere else, and choose layouts with media features (width, pointer), never the user agent.
- Sidebar, catalogue, and home page content (including the home page's `featured` topics) lives only in `navigation.json`; a topic's `route` must be a value in `FeatureRoute.ts`, mapped to its screen in `FeatureDestination`. Do not hard-code categories or topics in components.
- Components keep their own state with `useState`. Do not add a state library, context store, or data-fetching library as incidental refactoring.
- Components do not call `fetch` or read browser APIs directly: use the feature's repository (`executeRequest` and `executeAxiosRequest` own the timeout, cancellation, and errors, using the shared `httpRequest` helpers for URL validation, JSON headers, and formatting; `readBrowserInfo` takes the environment as a parameter so tests can fake it).
- Feature screens are lazily loaded, so each one is its own chunk, and take no props from the app. A feature shows results in place (the fetch response appears under its form); deeper URLs open their topic ([decision 0007](doc/decisions/0007-inline-fetch-response.md)).
- To add a feature, follow [Adding a feature](doc/architecture/application.md#adding-a-feature). Details: [application architecture](doc/architecture/application.md).

## Coding Standards

- Follow the closest existing feature and match the surrounding code.
- Types and files with an iOS counterpart use the iOS name (`ContentView`, `CategorySidebar`, `FeatureCatalogScreen`, `NavigationMenu`, `FeatureRoute`, `LabDemoSection`); web-only pieces keep web names.
- Function components with named exports; `@/` imports from `src/`; no `any`.
- Use the Slate palette through the Tailwind theme colours (`bg-surface`, `text-on-surface-variant`, `border-outline-variant`, …), always with the matching `on-…` colour; no raw colours in components. Light and dark follow `prefers-color-scheme` until the person uses `ColorSchemeToggle`, which sets `data-theme` on `<html>`; check both schemes.
- Main actions use `LabButton` (`variant="secondary"` for the action beside it), and fields use `labInputClassName`. Navigation rows use `LabListCard` (the desktop `NavigationTree` uses compact rows). Demo topics use `LabDemoPage` with one `LabDemoSection` per technique.
- Use semantic HTML first (`button`, `a`, `label`, headings, `dl`); every control has an accessible name, and icon-only controls have an `aria-label`.
- TypeScript samples: each snippet must equal the body of the function that runs it (write `` \` `` and `\${` inside the template literal); `typescriptTopics.test.ts` fails if they differ. A new topic is added to that test's `topics` list.
- Every feature has tests next to it: pure logic as unit tests, screens as Testing Library render tests.

## Boundaries

- **Always:** run `npm run lint`, `npm test`, and `npm run build` before reporting done; open the change in a browser and check the console; keep tests deterministic (no live HTTP endpoint); update the matching `doc/` page when files move or documented behaviour changes; report what was not verified (other browsers, screen readers, real devices).
- **Ask first:** new dependencies; changes to the routing scheme or URL shapes; new environment variables (keep `.env.example` in sync); changes to the Content Security Policy.
- **Never:** add inline scripts or `<style>` elements, `eval`, `new Function`, or resources from other hosts (the production Content Security Policy blocks them; [decision 0009](doc/decisions/0009-content-security-policy.md)); commit `.env.local`, keys, or tokens; put secrets in `VITE_` variables (they are bundled into the page); log request URLs, payloads, or response bodies.
