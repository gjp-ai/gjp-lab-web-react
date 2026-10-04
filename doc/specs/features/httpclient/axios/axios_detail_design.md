# axios detailed design

Status: Implemented, with known gaps

Requirements: [axios](axios_requirement.md)

## Implementation goal

Plug an axios client into the [shared HTTP client layout](../shared/shared_detail_design.md), configured so it reports the same details as fetch, and add a comparison card.

## Source map

| Source | Responsibility |
| --- | --- |
| [`AxiosScreen.tsx`](../../../../../src/features/httpclient/axios/AxiosScreen.tsx) | The `HttpClient` for axios and the **fetch or axios?** card |
| [`axiosRepository.ts`](../../../../../src/features/httpclient/axios/axiosRepository.ts) | The configured axios instance and `executeAxiosRequest` |
| [`axiosSnippet.ts`](../../../../../src/features/httpclient/axios/axiosSnippet.ts) | `buildAxiosSnippet`: the idiomatic axios call for the form |
| [`FeatureDestination.tsx`](../../../../../src/app/FeatureDestination.tsx) | Lazily loads the screen for `axios`; axios is only in this chunk |

## The axios instance

| Setting | Why |
| --- | --- |
| `timeout: 15000` | Same limit as fetch, without an `AbortSignal.timeout` |
| `validateStatus: () => true` | axios rejects outside 2xx by default; the page shows every status like fetch |
| `responseType: 'text'` and an identity `transformResponse` | Keeps the raw body, so the page measures and pretty-prints it like fetch |

`executeAxiosRequest` passes the caller's `signal`; a cancelled request rethrows axios's `CanceledError`. `ECONNABORTED` and `ETIMEDOUT` become the timeout message, and any other failure the network and CORS message. Response headers are read from axios's header object, joined when repeated, lower-cased, and sorted.

## Request body

`requestBody` sends the payload text for POST and PUT. axios's default request transform sends a JSON string trimmed and turns other text into a JSON string in quotes, so the page's hint differs from fetch, which sends text as typed.

## Known gaps

| Gap | Effect | Suggested fix |
| --- | --- | --- |
| Interceptors and instances with a `baseURL` are only described | Readers do not see them run | Add a section that logs request timing through an interceptor |
| The page's `validateStatus` hides axios's default rejection | Readers may expect 404 to resolve in their own code | The comparison and snippet comment state the default |

## Verification

- Automated: `axiosRepository.test.ts` (with an adapter: any status, headers and size, JSON headers and body only for POST and PUT, text sent as a JSON string, timeout and network messages, cancellation, no request for an invalid URL); `axiosSnippet.test.ts`; `AxiosScreen.test.tsx` (the repository mocked: send, axios snippet and source, comparison); the shared layout tests.
- Manual: AXI-AC-01 to AXI-AC-08 in Chrome and Safari, at phone and desktop widths, with the network offline in developer tools.
