# Feature: Maintenance

Status: Implemented

## Goal

Check at startup whether GJP Lab is temporarily unavailable, tell users clearly when it is, and let them check again without reloading the page.

## Scope

### In scope

- Reading the maintenance flag when the page loads, and choosing between maintenance and the navigation.
- The maintenance screen shown when the flag is on.
- Retrying the maintenance check from that screen.

### Out of scope

- Switching an open page into maintenance.
- Messages supplied by the server.

## Behavior

- On every page load, including a reload or a direct topic link, the page shows only its background while the flag loads (usually a few milliseconds, at most 5 seconds), then opens the URL's screen or maintenance. There is no splash screen.
- Maintenance appears only when startup reads the flag as on.
- **Try again** requests the flag again, with the same 5-second limit; the button shows "Checking…" and is disabled meanwhile.
- If the flag is now off, or the check fails, the navigation opens. If it is still on, the maintenance screen stays.

## UI & Navigation

- Full-window content: a wrench icon, the heading "We'll be back soon", an explanation, and a **Try again** button.
- Centred and width-limited; supports light and dark mode and text zoom.

## Rules & Constraints

- The flag is `maintenanceEnabled` in the JSON at `AppConfig.remoteConfigUrl` (default `public/remote-config.json`, override with `VITE_REMOTE_CONFIG_URL`).
- A failed check fails open to the navigation.
- The screen shows no personal data and logs nothing.

## Platform limitations

- The flag is read by the browser, so anyone can see it; it is not a security control.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| MNT-AC-01 | Startup reads the flag as on | The maintenance screen appears. |
| MNT-AC-05 | Load a direct topic link with the flag off | That topic opens without a splash. |
| MNT-AC-06 | The flag file is missing at startup | The navigation opens (fail open). |
| MNT-AC-02 | The flag is turned off, then **Try again** | The navigation opens. |
| MNT-AC-03 | The flag is still on, then **Try again** | The maintenance screen stays. |
| MNT-AC-04 | The network is off, then **Try again** | The navigation opens (fail open). |

## Technical implementation constraints

- Source lives in `src/app/startup/`; the retry decision stays with `App`.
- No new dependencies.

## Related documents

- [Detailed design](maintenance_detail_design.md)
