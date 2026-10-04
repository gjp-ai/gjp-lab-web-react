# Feature: Clipboard permissions

Status: Implemented

## Goal

Show how a page writes to and reads from the clipboard with the Async Clipboard API, what each browser asks the person first, and how to handle a copied secret, as a learning sample for a sensitive browser capability.

## Scope

### In scope

- Copying text the person can edit.
- Copying a sample one-time code, then clearing the clipboard after a countdown, on **Clear now**, and when the person leaves the topic.
- Reading the clipboard on request, and receiving a paste event, side by side.
- The clipboard permission states the browser reports, and whether the page is a secure context.
- A plain statement of what a page cannot do with the clipboard.

### Out of scope

- Images, HTML, or other formats (`ClipboardItem`).
- The older `document.execCommand('copy')`.
- Watching the clipboard, or reading it without a click.

## Behavior

- **Copy** writes the field's text and reports success, or the reason the browser refused.
- **Copy code** writes the sample code and shows a countdown (20 seconds). When it ends, the page writes an empty string to clear the clipboard and reports whether that worked; if the browser refuses (no recent click, or no focus), it says so and suggests **Clear now**. **Clear now** clears at any time.
- Leaving the topic while the code may still be on the clipboard clears it.
- **Read the clipboard** asks the browser for the text. On success, the page shows it (up to 120 characters) and how many characters it got; otherwise it explains the refusal. Pasting into the paste field shows the same, without any prompt. **Forget it** removes the text from the page.
- **Permissions** shows Secure page (Yes or No), Clipboard API (Available or Not available), and the read and write permission states, updating if they change in site settings.

## UI & Navigation

- Entry point: **Security** → **Clipboard permissions** (`/security/clipboard`).
- An introduction and five cards: **Copy text**, **Copy a secret, then clear it**, **Paste**, **Permissions**, and **What a page cannot do**.
- Results appear in status messages that screen readers announce; the countdown itself is not announced each second.
- Every control is keyboard-reachable and labelled. Light and dark mode, text zoom, and phone width are supported.

## Rules & Constraints

- Use only `navigator.clipboard.writeText`, `navigator.clipboard.readText`, the `paste` event, and `navigator.permissions.query`.
- Never read the clipboard except when the person selects **Read the clipboard** or pastes.
- Clipboard text is shown only on the page; it is never stored, logged, or sent.
- The sample code is made up.
- Permission states that a browser does not report are shown as "Not reported by this browser", not guessed.

## Platform limitations

- The Clipboard API exists only in secure contexts (HTTPS or localhost).
- Chromium grants writing while the page has focus and asks once for permission to read. Safari and Firefox allow writing only during a click, show a Paste button for each read, and do not report clipboard permissions.
- Clearing by itself after the countdown therefore works in Chromium while the page has focus, and usually fails in Safari and Firefox, which then show **Clear now**.
- Clearing replaces whatever is on the clipboard at that moment, and cannot remove clipboard history or copies synced to other devices.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| CLP-AC-01 | Select **Copy**, then paste elsewhere | The field's text is pasted; the page says it copied. |
| CLP-AC-02 | In Chrome, select **Copy code** and wait 20 seconds with the page focused | The countdown ends, the page says it cleared the clipboard, and pasting gives nothing. |
| CLP-AC-03 | In Safari or Firefox, select **Copy code** and wait | The page says it could not clear by itself; **Clear now** clears. |
| CLP-AC-04 | Select **Copy code**, then open another topic | Pasting gives nothing (best effort in Safari and Firefox). |
| CLP-AC-05 | Select **Read the clipboard** | The browser asks first; on agreement the text is shown, otherwise the refusal is explained. |
| CLP-AC-06 | Paste into the paste field | The text is shown with no prompt. |
| CLP-AC-07 | In Chrome, block clipboard access in site settings | Read permission shows Denied without a reload. |
| CLP-AC-08 | Open the topic on plain http from another device | Secure page says No, and copying explains the secure page rule. |

## Technical implementation constraints

- Source lives in `src/features/security/clipboard/`: route `clipboard`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The screen does not read browser APIs: a repository takes the clipboard environment as a parameter and turns refusals into readable reasons.
- No new dependencies.

## Related documents

- [Detailed design](clipboard_detail_design.md)
