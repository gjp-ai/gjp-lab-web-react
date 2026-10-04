# Clipboard permissions detailed design

Status: Implemented, with known gaps

Requirements: [Clipboard permissions](clipboard_requirement.md)

## Implementation goal

One `LabDemoPage` with a card per technique. A repository wraps the Async Clipboard API and the Permissions API, taking the browser environment as a parameter and returning discriminated results (`{ ok: true }` or `{ ok: false, reason }`), so the screen only shows outcomes and tests never touch the real clipboard.

## Source map

| Source | Responsibility |
| --- | --- |
| [`ClipboardScreen.tsx`](../../../../../src/features/security/clipboard/ClipboardScreen.tsx) | Screen and the `CopyDemo`, `SecretDemo`, `PasteDemo`, and `PermissionsDemo` cards |
| [`clipboardRepository.ts`](../../../../../src/features/security/clipboard/clipboardRepository.ts) | `ClipboardEnvironment`, `copyText`, `readText`, and `watchPermission` |
| [`FeatureRoute.ts`](../../../../../src/app/navigation/FeatureRoute.ts), [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx), [`navigation.json`](../../../../../src/app/navigation/navigation.json) | Route `clipboard`, its lazy screen, and the catalogue entry |

## Ownership and state

The screen is reached at `/security/clipboard`. `ClipboardScreen` keeps the environment in state (from the optional `environment` prop, or `browserClipboardEnvironment()`), so effects that depend on it run once. Each card owns its own state:

| Card | State | Notes |
| --- | --- | --- |
| `CopyDemo` | `text`, `status` | |
| `SecretDemo` | `clearIn` (seconds left), `status`, and a ref `holdsCode` | The countdown effect sets a one-second timeout per step and clears it in cleanup; at 0 it clears the clipboard, ignoring the result if the effect has been replaced |
| `PasteDemo` | `pasteField`, `received` (the shown preview), `status` | |
| `PermissionsDemo` | `readState`, `writeState` | One `watchPermission` subscription each, removed in cleanup |

`clearAfterSeconds` (default 20) is a prop that only tests change.

## Clearing a copied secret

- `holdsCode` is set when the code is copied and unset when a clear succeeds. It is a ref, not state, because only cleanup reads it and it never changes what is shown.
- A second effect does nothing on setup and returns a cleanup that clears the clipboard if `holdsCode` is still set. It runs when the screen closes; the click on a link that closes it usually still counts as the recent click Safari and Firefox require.
- Clearing writes an empty string. The page cannot check first whether the clipboard still holds the code, because that would need read permission.

## Browser differences

| | Chromium | Safari | Firefox |
| --- | --- | --- | --- |
| Write | Allowed while the page has focus | During a click | During a click |
| Read | Asks once (`clipboard-read`) | Paste button each time | Paste button each time |
| `permissions.query` for clipboard names | Supported | Rejects (shown as "Not reported") | Rejects (shown as "Not reported") |

`watchPermission` casts the name to `PermissionName`, because TypeScript lists only names every browser supports. A rejected query, or no Permissions API, reports `unsupported`.

## Privacy and security

- Text read from the clipboard or a paste event is rendered as text in a `<pre>`, shortened to 120 characters, and kept only in component state; **Forget it** and leaving the topic discard it.
- Nothing is logged, stored, or sent. The sample code is made up.
- Refusals are mapped from `NotAllowedError` to a reason the person can act on; other errors show their message.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Clearing may replace newer clipboard content | Something copied in another app during the countdown is erased | Accepted and stated on the page; a check would need read permission |
| Clearing by itself fails in Safari and Firefox | The code stays until **Clear now** | Platform limit; the page says so |
| The embedded browser in some tools denies clipboard access | Every action reports a refusal | Use a regular browser |
| Text only | Images and rich text are not shown | Add a `ClipboardItem` demo if needed |

## Verification

- Automated: `clipboardRepository.test.ts` (write and read, refusals, missing API and the secure page rule, permission state and change, unsupported); `ClipboardScreen.test.tsx` (copy, copy and clear when the time is up, clear on leaving, read and paste and forget, permission states, insecure page).
- Manual: CLP-AC-01 to CLP-AC-08 in Chrome, Safari, and Firefox on desktop, and Safari on iOS, in light and dark mode at phone and desktop widths.
