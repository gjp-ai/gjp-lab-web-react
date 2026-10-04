# 0004: Slate design tokens in Tailwind, with no component library

Status: Accepted, 2026-10-04

## Context

The labs share the Slate design system: black, white, neutral `#E8E8E8`, and a warm `#FFFCF8` canvas, with matching dark values. The earlier plan named Tailwind CSS and shadcn/ui. A component library brings its own look and many files to read, which works against a lab whose screens should be easy to follow.

## Decision

- `src/common/theme/theme.css` defines the Slate roles as CSS variables (light, and dark under `prefers-color-scheme`) and maps them to Tailwind colours with `@theme inline` (`bg-surface`, `text-on-surface-variant`, `border-outline-variant`, …).
- Components style themselves with those Tailwind classes only; no raw colours and no other CSS approach.
- Shared pieces are small local components (`LabButton`, `LabListCard`, `LabDemoPage`, `LabDemoSection`). No component library is added; reconsider shadcn/ui only when a topic needs a complex widget such as a dialog or combobox.

## Consequences

- Colours change in one file and follow the system light or dark setting without extra code.
- The values match the iOS `LabTheme` and the Android colour scheme, so the three labs look alike.
- Accessible behaviour for complex widgets must be written by hand until a library is approved.

Related: the iOS lab's `LabTheme` and the Android lab's `GJPLabTheme` hold the same values.
