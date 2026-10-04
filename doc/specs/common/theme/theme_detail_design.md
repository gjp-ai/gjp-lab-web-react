# Slate design system

Status: Implemented

## Intent

GJPLab uses a restrained, high-contrast Slate direction based on black, white, neutral `#E8E8E8`, and a warm canvas `#FFFCF8`. The result should feel direct and technical: strong hierarchy, neutral surfaces, generous contrast, and minimal decorative colour. Error and success colours remain semantic status signals. The values match the iOS `LabTheme` and the Android colour scheme.

## Core palette

| Tailwind colour | Light | Dark | Primary use |
| --- | --- | --- | --- |
| `primary` | `#000000` | `#FFFFFF` | Strongest action and brand tile |
| `on-primary` | `#FFFFFF` | `#000000` | Content on `primary` |
| `primary-container` | `#E8E8E8` | `#343434` | Icon tiles and quiet emphasis |
| `background` | `#FFFCF8` | `#0D0D0D` | Page canvas |
| `surface` | `#FFFFFF` | `#151515` | Cards |
| `surface-container` | `#F1F1F1` | `#222222` | Code blocks and hover states |
| `on-surface` | `#1A1A1A` | `#E8E8E8` | Normal text |
| `on-surface-variant` | `#474747` | `#C6C6C6` | Supporting text |
| `outline-variant` | `#C6C6C6` | `#474747` | Hairline borders and dividers |
| `error` / `error-container` / `on-error-container` | `#BA1A1A` / `#FFDAD6` / `#410002` | `#FFB4AB` / `#93000A` / `#FFDAD6` | Failures |
| `success` | `#2E7D32` | `#81C784` | Successful HTTP status |

[`theme.css`](../../../../src/common/theme/theme.css) defines each role as a CSS variable, switches the values under `prefers-color-scheme: dark`, and maps them to Tailwind colours with `@theme inline`. Components use the Tailwind classes, never raw colours ([decision 0004](../../../decisions/0004-tailwind-slate-tokens.md)).

## Components

- [`LabButton`](../../../../src/common/theme/LabButton.tsx): the main action, a `primary` pill with `on-primary` text, at least 44 px tall, dimmed when pressed, and `primary-container` with `on-surface-variant` text when disabled. Focus shows a 2 px `primary` outline.
- [`LabListCard`](../../../../src/common/theme/LabListCard.tsx): a navigation row as its own `surface` card with 18 px corners and a 0.5 px `outline-variant` border; a selected row gets a 1 px `primary` border. With `to` it is a link; without it, a plain card.
- [`LabDemoPage` and `LabDemoSection`](../../../../src/common/theme/LabDemoSection.tsx): a demo page with an `on-surface-variant` introduction, and cards with an 18 px radius, a soft shadow, a real `h2` heading, a caption, and the live sample.
- [`LabMark`](../../../../src/common/theme/LabMark.tsx): the flask mark on the iOS 108-unit grid, drawn with `currentColor`. The favicon uses the same paths.

## Layout

Every pane uses the `background` canvas with its content limited to 720 px and centred; beside the desktop tree sidebar the content may grow to 1120 px. Panes are separated by 1 px `outline-variant` dividers. See the [sidebar detailed design](../../app/navigation/sidebar_detail_design.md) for the breakpoints.

## Accessibility and review checklist

- Pair every background with its `on-…` colour; check light and dark mode.
- Keep visible focus on every link and button (`focus-visible` outlines).
- Use real headings, labels, and lists; give icon-only controls an `aria-label`, and mark decorative icons `aria-hidden`.
- Never rely on colour alone for status; HTTP status also shows the number.
- Check text zoom to 200 % and phone width.
