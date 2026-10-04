# Feature: Browser & device

Status: Implemented

## Goal

Show a read-only snapshot of the browser and device a page runs on, as a learning sample for reading platform information on the web.

## Scope

### In scope

- Browser: name and version, language, online state, cookies, colour scheme, and reduced-motion preference.
- Device: screen size, pixel ratio, colour depth, CPU cores, approximate memory, and touch points.

### Out of scope

- Identifiers, fingerprinting, location, battery, or anything that needs a permission.
- Live updates while the screen is open.

## Behavior

- The screen reads the values once when it opens.
- Values a browser does not report (for example memory in Safari and Firefox) say "Not reported".

## UI & Navigation

- Entry point: **Others** → **Browser & device** (`/others/browserInfo`).
- An introduction and two cards, **Browser** and **Device**, each a list of label and value rows.
- Light and dark mode and text zoom are supported.

## Rules & Constraints

- Use only public, permission-free browser APIs.
- Never read or show anything that identifies the user.

## Platform limitations

- Browsers reduce or round some values for privacy (`deviceMemory` is rounded and Chromium-only; the user-agent string may be frozen).
- Screen size is in CSS pixels and can differ from the physical resolution.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| BRW-AC-01 | Open in Chrome | The browser name shows Chrome with its version, and memory is reported. |
| BRW-AC-02 | Open in Safari | Safari is named, and memory says "Not reported". |
| BRW-AC-03 | Switch the system to dark mode and reopen | Colour scheme reads Dark. |

## Technical implementation constraints

- Source lives in `src/features/others/browserinfo/`.
- The component does not read browser APIs; `readBrowserInfo` does, with the environment passed in.

## Related documents

- [Detailed design](browserinfo_detail_design.md)
