# HTTP client shared layout detailed design

Status: Implemented

## Implementation goal

Give every HTTP client topic the same page, so readers compare the clients rather than two layouts: a Request card with examples, a Response card, and a Code card. A topic supplies only how to send and how to show its code ([decision 0008](../../../../decisions/0008-shared-http-client-layout-and-axios.md)). The behaviour is specified in the [fetch requirement](../fetch/fetch_requirement.md); the [axios requirement](../axios/axios_requirement.md) reuses it.

## Source map

| Source | Responsibility |
| --- | --- |
| [`HttpClientScreen.tsx`](../../../../../src/features/httpclient/shared/HttpClientScreen.tsx) | `HttpClient` (what a topic plugs in), `HttpClientScreen` (form, response, loading and error state, cancellation, examples, code tabs), and `HttpClientCard` |
| [`HttpResponseView.tsx`](../../../../../src/features/httpclient/shared/HttpResponseView.tsx) | `StatusBadge`, `ResponseMeta` (time and size), and the Body and Headers tabs |
| [`exampleApis.ts`](../../../../../src/features/httpclient/shared/exampleApis.ts) | `ExampleApi`, `RequestPreset`, and the examples for the seven APIs |
| [`HttpResponse.ts`](../../../../../src/features/httpclient/shared/HttpResponse.ts) | `HttpMethod`, `supportsPayload`, `HttpResponse`, `reasonPhrase`, and `formatBytes` |
| [`httpRequest.ts`](../../../../../src/features/httpclient/shared/httpRequest.ts) | `HttpRequestError`, `parseHttpUrl`, `requestHeaders`, `requestBody`, `prettyJson`, `sortHeaders`, `utf8Size`, the timeout and network messages, and the snippet helpers `quoteJs` and `indentJson` |
| [`jsonPayload.ts`](../../../../../src/features/httpclient/shared/jsonPayload.ts) | `checkPayload`: empty, JSON (with a formatted copy), or other text |
| [`LabTabs.tsx`](../../../../../src/common/theme/LabTabs.tsx) | Shared accessible tabs |

## The `HttpClient` contract

| Member | Meaning |
| --- | --- |
| `intro` | The page introduction |
| `send(method, url, payload, signal)` | Sends the request. Resolves for every HTTP status; rejects with an `HttpRequestError` message, or with the abort reason when `signal` aborts |
| `snippet(method, url, payload)`, `snippetCaption` | The hand-written call for the request in the form |
| `invalidJsonHint` | What the client does with a body that is not JSON |
| `source` | The implementation file name, its text (imported with `?raw`), and a caption |

`HttpClientScreen` renders its `children` after the Code card, for topic-specific sections.

## Ownership and state

| State | Owner | Lifetime | Meaning |
| --- | --- | --- | --- |
| `method`, `url`, `payload` | `HttpClientScreen` (`useState`) | Screen | Request input; an example overwrites the method and URL, and the payload only for `POST` and `PUT` |
| Chosen example API | `Examples` (`useState`) | Screen | Which API's examples are listed; starts at JSONPlaceholder |
| `isLoading`, `errorMessage` | `HttpClientScreen` (`useState`) | Screen | In flight; last failure |
| `controller` | `HttpClientScreen` (`useRef`) | Screen | Cancels the running request on a new send or unmount |
| `response` | `HttpClientScreen` (`useState`) | Screen | The last completed response; cleared when a request fails |

## Layout

The screen root is a CSS container. From 56 rem of pane width, Request and Response sit side by side; Code and any `children` span the width below. Topic sections can use the same container (for example `@xl:` in the axios comparison).

## Verification

- Automated: `HttpClientScreen.test.tsx` (with a fake client: the JSONPlaceholder default, intro and children, examples and the snippet follow the form, switching the example API, the JSON hint and Format, the status badge with time and size and the tabs, an error replacing the response, the implementation tab); `HttpResponse.test.ts`; `httpRequest.test.ts`; `jsonPayload.test.ts`; `exampleApis.test.ts`; `LabTabs.test.tsx`.
- Manual: the fetch and axios acceptance criteria.
