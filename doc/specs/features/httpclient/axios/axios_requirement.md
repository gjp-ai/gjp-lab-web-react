# Feature: axios

Status: Implemented

## Goal

Let a developer send the same requests as in the fetch topic with axios, see the axios code for each one, and understand when the library is worth adding.

## Scope

### In scope

- The shared request, response, examples, and code page ([fetch requirement](../fetch/fetch_requirement.md), behaviour and UI), with axios as the client.
- An axios snippet that follows the form, and the source of `axiosRepository.ts`.
- A comparison of fetch and axios.

### Out of scope

- Interceptors, instances with a `baseURL`, upload progress, and other axios features beyond what the page needs (named in the comparison only).
- Authentication and custom headers.

## Behavior

- Everything in the fetch requirement's Behavior applies, with axios sending the request. Every status is shown, as in fetch, because the page sets `validateStatus` to accept all of them.
- A body that is not JSON is sent as a JSON string (axios wraps it in quotes); the hint under the body says so.
- **This request** shows the idiomatic call: `axios.get(url)`, `axios.post(url, object)`, `axios.put(url, object)`, or `axios.delete(url)`, with no headers.

## UI & Navigation

- Entry point: **HTTP Client** → **axios** (`/httpClient/axios`).
- The shared Request, Response, and Code cards (tabs **This request** and **axiosRepository.ts**), then a **fetch or axios?** card: a table on wide panes and one block per task on narrow ones, covering where each comes from, HTTP errors, JSON responses and bodies, timeouts, cancellation, shared settings, and upload progress.

## Rules & Constraints

- `axios` is pinned to an exact version and loaded only by this topic ([decision 0008](../../../../decisions/0008-shared-http-client-layout-and-axios.md)).
- The rules of the fetch requirement apply (http and https only, 15-second timeout, JSON headers, nothing logged).

## Platform limitations

- In browsers axios uses `XMLHttpRequest`, so CORS and visible headers work as in fetch.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| AXI-AC-01 | Send the default `GET` | "200 OK" with the post, time, and size. |
| AXI-AC-02 | ReqRes **Missing user (404)** | "404 Not Found" shown, not an error message. |
| AXI-AC-03 | ReqRes **Delete a user (204)** | "204 No Content" and "(empty body)". |
| AXI-AC-04 | httpbin **Echo a POST** | The echo shows the JSON body and `Content-Type: application/json; charset=UTF-8`. |
| AXI-AC-05 | Choose **Create a post** | This request reads `axios.post('https://jsonplaceholder.typicode.com/posts', { … })`. |
| AXI-AC-06 | Type `hello` as a PUT body | The hint says axios will send it as a JSON string. |
| AXI-AC-07 | Phone width | The comparison shows one block per task, with no sideways scrolling. |
| AXI-AC-08 | Go offline and send | "The request failed" with the network and CORS message. |

## Technical implementation constraints

- Source lives in `src/features/httpclient/axios/`; shared code in `src/features/httpclient/shared/`.
- Route `axios`, the screen in `FeatureDestination`, and the topic in `navigation.json`.
- Tests never call the network: the repository takes an axios `adapter`, and the screen test mocks the repository.

## Related documents

- [Detailed design](axios_detail_design.md)
- [fetch requirement](../fetch/fetch_requirement.md)
- [Shared layout](../shared/shared_detail_design.md)
