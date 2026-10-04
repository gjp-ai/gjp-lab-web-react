# Browser & device detailed design

Status: Implemented, with known gaps

Requirements: [Browser & device](browserinfo_requirement.md)

## Implementation goal

Read every value in one repository function that takes the browser environment as a parameter, so the component stays simple and tests can pass a fake environment.

## Source map

| Source | Responsibility |
| --- | --- |
| [`BrowserInfoScreen.tsx`](../../../../../src/features/others/browserinfo/BrowserInfoScreen.tsx) | Screen and `InfoSection` cards (a description list per section) |
| [`browserInfoRepository.ts`](../../../../../src/features/others/browserinfo/browserInfoRepository.ts) | `readBrowserInfo`, `browserName`, and the `BrowserEnvironment` type |

## Data sources

| Row | Source |
| --- | --- |
| Browser | `navigator.userAgent`, parsed by `browserName` (Edge and Opera checked before Chrome, Chrome before Safari) |
| Language, Online, Cookies | `navigator.language`, `navigator.onLine`, `navigator.cookieEnabled` |
| Colour scheme, Reduced motion | `matchMedia('(prefers-color-scheme: dark)')`, `matchMedia('(prefers-reduced-motion: reduce)')` |
| Screen, Colour depth | `screen.width` × `screen.height`, `screen.colorDepth` |
| Pixel ratio | `devicePixelRatio` |
| CPU cores, Memory, Touch points | `navigator.hardwareConcurrency`, `navigator.deviceMemory` (Chromium only), `navigator.maxTouchPoints` |

## Ownership

`BrowserInfoScreen` stores the result of `readBrowserInfo()` with a `useState` initializer, so the values are read once per visit.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| The user-agent string is unreliable | Browsers freeze or reduce it; versions may be approximate | Use `navigator.userAgentData` where available |
| Values do not update | Going offline or changing the colour scheme needs a reopen | Listen to `online`/`offline` and `matchMedia` change events |
| No render test for the screen | Only the repository is tested | Add a Testing Library test with a fake environment |

## Verification

- Automated: `browserInfoRepository.test.ts` (browser names, both sections, memory not reported).
- Manual: BRW-AC-01 to BRW-AC-03 in Chrome, Safari, and Firefox.
