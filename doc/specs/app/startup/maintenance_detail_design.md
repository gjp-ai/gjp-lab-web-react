# Maintenance detailed design

Status: Implemented, with known gaps

Requirements: [Maintenance](maintenance_requirement.md)

## Implementation goal

Read the flag once when `App` mounts, show a blocking message when it is on, and let the user re-check it through the same `fetchMaintenanceMode` call.

## Source map

| Source | Responsibility |
| --- | --- |
| [`MaintenanceScreen.tsx`](../../../../src/app/startup/MaintenanceScreen.tsx) | Presentation; reports taps through `onRetry` and shows `isRetrying` |
| [`App.tsx`](../../../../src/app/App.tsx) | Owns the phase (`checking`, `maintenance`, `app`) and `isRetrying`; runs the startup check and the retry |
| [`maintenanceMode.ts`](../../../../src/app/startup/maintenanceMode.ts) | Fetch with `AbortSignal.timeout`, `cache: 'no-store'`, and fail-open parsing |
| [`remote-config.json`](../../../../public/remote-config.json) | The bundled flag |

## Ownership and flow

`App` starts in `checking`, which renders an empty `main` with the `background` colour, `aria-busy`, and the label "Loading GJP Lab". An effect calls `fetchMaintenanceMode` and moves to `maintenance` or `app`; an `isCurrent` flag ignores a result that arrives after unmount (for example in React's development double-invoke). There is no minimum wait.

`App` renders `MaintenanceScreen` instead of `ContentView` while the phase is `maintenance`. **Try again** sets `isRetrying`, awaits `fetchMaintenanceMode`, clears `isRetrying`, and switches to `app` when the result is `false`. The disabled button prevents overlapping checks.

`fetchMaintenanceMode` returns `true` only for a successful response whose JSON has `maintenanceEnabled === true`; an HTTP error, invalid JSON, a missing or non-boolean flag, a network error, or the timeout all return `false`.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The flag lives in a static file | Turning maintenance on means redeploying or pointing `VITE_REMOTE_CONFIG_URL` at a server | Integrate a remote-config service (planned Firebase topic) |
| A slow flag server delays the page | Users see an empty page for up to 5 seconds | Lower `remoteConfigTimeoutMs`, or open the app first and switch to maintenance when the flag arrives |
| No message from the server | Users do not learn when the app will be back | Add an optional `message` field to the JSON |

## Verification

- Automated: `App.test.tsx` (the loading page, then the navigation; maintenance, then a retry that opens the app); `maintenanceMode.test.ts` (every fail-open path).
- Manual: MNT-AC-01 to MNT-AC-06 by editing `public/remote-config.json` while `npm run dev` runs, and with the network offline in developer tools.
