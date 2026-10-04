# Feature: Splash screen

Status: Implemented

## Goal

Show a recognizable startup screen while the app decides between the normal navigation and maintenance, and keep startup bounded when the maintenance check is slow or fails.

## Scope

### In scope

- The branded splash shown when the page loads.
- The minimum display time and the maintenance check that runs alongside it.
- Choosing maintenance or the navigation exactly once.

### Out of scope

- The browser's own loading UI before the script runs.
- Showing the splash again on in-app navigation.

## Behavior

- The splash appears on every page load, including a reload or a direct link to a topic.
- It stays for at least 3 seconds. Meanwhile the maintenance flag is requested and given up after 5 seconds.
- When both waits are done, maintenance opens if the flag is on; otherwise the URL's screen opens.
- A failed, slow, or unreadable check counts as maintenance off.

## UI & Navigation

- Full-window splash: the GJP Lab mark in a `primary` tile and the name "GJP Lab".
- It follows the system light or dark setting and is announced as "Loading GJP Lab".

## Rules & Constraints

| Decision | Value |
| --- | --- |
| Minimum splash duration | 3 seconds (`AppConfig.minimumSplashMs`) |
| Maintenance check timeout | 5 seconds (`AppConfig.remoteConfigTimeoutMs`) |
| Failure or timeout | Maintenance off (fail open) |
| Destination | Decided once per page load |

## Platform limitations

- A cached `remote-config.json` can delay a maintenance change until the browser refetches it; the request asks for `no-store`.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| SPL-AC-01 | Load the page with maintenance off | The splash shows for about 3 seconds, then the URL's screen. |
| SPL-AC-02 | Load a direct topic link | After the splash, that topic opens. |
| SPL-AC-03 | The flag file is missing or the network is off | The navigation opens after the splash. |
| SPL-AC-04 | The flag is on | Maintenance opens after the splash. |
| SPL-AC-05 | Dark mode | The tile and text invert and stay readable. |

## Technical implementation constraints

- Source lives in `src/app/` (`App`) and `src/app/startup/`.
- The maintenance check goes through `fetchMaintenanceMode`; timings come from `AppConfig`.
- No new dependencies.

## Related documents

- [Detailed design](splash_detail_design.md)
- [Maintenance requirement](maintenance_requirement.md)
- [Application architecture](../../../architecture/application.md)
