# Feature: Hide content when the page is hidden

Status: Implemented

## Goal

Keep sensitive content off the screen while the person is not using the page, as a learning sample for the Page Visibility API. It is the web counterpart of the iOS and Android **Block App During Calls** and **Sensitive content** topics: a browser cannot see phone calls, screenshots, or screen recordings, but it can tell a page when it is hidden or its window loses focus.

## Scope

### In scope

- A sample of sensitive content (an account card) that is removed from the page while hidden.
- Hiding automatically when the page is hidden (another tab, a minimised window, a locked screen, or another app, including answering a call on a phone), and optionally when the window loses focus.
- An option to keep the content hidden after the page returns until the person chooses to show it.
- Hiding by hand (**Hide now**) and showing again (**Show content**).
- The settings, saved in this browser.
- The live page state and a log of what happened, so the person can see what the page did while they were away.
- A plain statement of what a web page cannot detect.

### Out of scope

- Detecting phone, VoIP, or video calls; detecting screenshots or screen recordings; preventing either. Browsers offer no API for these.
- Protecting content on other screens of the app: only this topic's sample content is hidden.
- Sign-in, locking with a password or passkey, or any real account data.

## Behavior

- When the page becomes hidden and **Hide when the page is hidden** is on, the sample content is replaced by a placeholder at once.
- When the window loses focus and **Also hide when the window loses focus** is on, the content is replaced in the same way.
- When the page is visible and focused again, the content returns automatically, unless **Keep hidden until I choose to show it** is on; then the placeholder stays, says why it appeared, and offers **Show content**.
- **Hide now** hides the content until the person selects **Show content**, whatever the page state.
- The placeholder replaces the values in the page; they are not blurred or covered, so they cannot be read from the page, copied, or announced by a screen reader while hidden.
- The page state shows whether the page is visible and whether the window has focus, and updates as they change.
- The activity log lists each change (page hidden or visible, window focused or not, hidden or shown by hand) and what happened to the content. It keeps the last six entries and is cleared when the screen closes.
- The settings apply from the next change; changing them does not show or hide the content by itself.

## UI & Navigation

- Entry point: **Security** → **Hide content when the page is hidden** (`/security/hideContent`).
- An introduction and four cards: **Sensitive content**, **When to hide**, **Page activity**, and **What a page cannot detect**.
- **Sensitive content** shows the sample card, or the placeholder with the reason, and one button: **Hide now** or **Show content**.
- **When to hide** has three checkboxes, saved in this browser. Defaults: hide when the page is hidden on; hide on focus loss off; keep hidden until shown off.
- **Page activity** lists **Page** (Visible or Hidden) and **Window** (Focused or Not focused), and the activity log ("Nothing yet" when empty).
- Every control is keyboard-reachable and labelled. A status message tells screen-reader users when the content is hidden or shown. Light and dark mode, text zoom, and phone width are supported.

## Rules & Constraints

- Use only public, permission-free browser events: `visibilitychange` with `document.visibilityState`, window `blur` and `focus`, and `document.hasFocus()`.
- The sample values are made up and labelled as sample data. Nothing is sent over the network or written to the console.
- Only the three settings are saved, under one local storage key. If storage is blocked or holds anything unexpected, the defaults apply and the page still works.
- No timers, polling, or workarounds to guess at calls, screenshots, or other apps.

## Platform limitations

- No browser tells a page about phone or video calls, screenshots, or screen recordings. On a phone, answering a call usually sends the browser to the background, which hides the page; that is the only part of a call a page can observe.
- The browser decides when to take the image shown in its tab overview or the system app switcher. The page hides its content as soon as it is told, but cannot guarantee the image is taken afterwards.
- Desktop browsers may not report a window that is covered by another window as hidden. Focus loss is the nearest signal, and it also fires when the person uses the address bar, developer tools, or a browser dialog.
- Someone who can run code in the page, or who sees the screen while the content is shown, can still read it. This reduces exposure; it does not replace access control.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| HID-AC-01 | Defaults: switch to another tab, then back | The log shows the page was hidden and the content hidden, then the page visible and the content shown. The card is visible again. |
| HID-AC-02 | Turn on **Keep hidden until I choose to show it**, switch tabs and back | The placeholder says the content was hidden while the page was in the background; **Show content** brings the card back. |
| HID-AC-03 | Turn on **Also hide when the window loses focus**, then click another window | The placeholder appears while the window is not focused and goes when it is focused again. |
| HID-AC-04 | Select **Hide now**, switch tabs and back | The content stays hidden until **Show content** is selected. |
| HID-AC-05 | Turn **Hide when the page is hidden** off, switch tabs and back | The log shows the page hidden and visible, and the content never hidden. |
| HID-AC-06 | Change a setting and reload | The setting is kept. |
| HID-AC-07 | On a phone, switch to another app and back, or answer a call | The content is hidden on return when it should be; the app switcher image hides the content on a best-effort basis. |
| HID-AC-08 | While hidden, inspect the page with a screen reader or the element inspector | The card number and code are not in the page. |

## Technical implementation constraints

- Source lives in `src/features/security/hidecontent/`: route `hideContent` in `FeatureRoute.ts`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- The screen does not read browser APIs: a repository takes the page environment as a parameter, so tests can pass a fake. The hiding decision and the settings are pure functions with unit tests.
- No new dependencies and no changes to other screens.

## Related documents

- [Detailed design](hidecontent_detail_design.md)
- [Application architecture](../../../../architecture/application.md)
- iOS and Android: `doc/specs/features/security/blockappduringcalls/` in `gjp-lab-ios-swift` and `gjp-lab-android-kotlin`
