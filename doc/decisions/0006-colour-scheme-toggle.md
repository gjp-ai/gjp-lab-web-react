# 0006: A light and dark toggle that overrides the system setting

Status: Accepted, 2026-10-04. Amends [0004](0004-tailwind-slate-tokens.md).

## Context

Decision 0004 switched the Slate colours only with `prefers-color-scheme`, so the page always matched the operating system. People often want a different scheme for one site, for example a dark lab page on a light desktop, and checking both schemes while building a feature meant changing a system setting.

## Decision

- `theme.css` writes each Slate role as `light-dark(<light>, <dark>)`, and `:root` uses `color-scheme: light dark`, so the system setting still decides by default. `:root[data-theme="light"]` and `:root[data-theme="dark"]` set `color-scheme` to one value and override it. Tailwind's Lightning CSS step converts `light-dark()` for older browsers.
- `ColorSchemeToggle` is an icon button named "Dark mode" with `aria-pressed`. It sits in the "GJP Lab" pane header in every layout, and at the bottom of the collapsed desktop rail.
- `useColorScheme` (`colorScheme.ts`) follows the system until the person presses the toggle, then saves the choice under `gjpLab.colorScheme` in local storage and sets `data-theme` on `<html>`.
- A small inline script in `index.html` applies a saved choice before the first paint, so a reload does not flash the other scheme.

## Consequences

- The saved choice wins over later system changes. There is no "follow the system" option in the interface; clearing site data restores it. Add a three-way control if people ask for it.
- `index.html` now has an inline script. A future Content Security Policy topic must allow it with a hash rather than `'unsafe-inline'`.
- `localStorage` and `PreferenceStorage` access moved to `src/common/config/preferenceStorage.ts`, shared with the sidebar preference.
- The Browser & device topic still reports the system setting, which is what `prefers-color-scheme` means.

Related: the iOS and Android labs follow the system setting only; this is a web-only addition.
