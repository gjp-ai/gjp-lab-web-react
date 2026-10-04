# Feature: fetch

Status: Implemented

## Goal

Let a developer build and send an HTTP request with the browser's native `fetch` API and inspect the response, as a learning sample for the HTTP Client category.

## Scope

### In scope

- Choose a method, enter a URL, and optionally a JSON payload.
- Fill the form from example requests to seven free public APIs, chosen from a menu.
- Send the request and show the status, body, and readable headers on the same page, under the form.
- Show the code: a `fetch` call for the request in the form, and the source of the implementation that sends it.
- A clear message, in place of the response, when the request cannot be sent or read.
- The response's time and size, and a hint when the payload is not valid JSON.

### Out of scope

- Authentication, custom headers, cookies, and request history.
- Third-party HTTP libraries (planned topic: axios).
- Uploads and streaming.

## Behavior

- The screen opens with the first example: `GET https://jsonplaceholder.typicode.com/posts/1`. The payload field starts with the POST example's body. No private or personal API is used by default.
- **Examples from** chooses an API; it shows the API's description, a link to its docs, and its example buttons. Choosing an API does not change the request. Choosing an example sets the method, URL, and (for `POST` and `PUT`) the payload, and clears any message. It does not send; **Send** does.
- The APIs, all free, keyless, and open to any origin (CORS):

  | API | Examples | Notes shown to the user |
  | --- | --- | --- |
  | JSONPlaceholder (default) | Get, list, create, replace, and delete posts | Writes are faked, not saved |
  | DummyJSON | Get, search, add, update, and delete products | Writes are not saved |
  | ReqRes | Get and list users, a missing user (404), create, update, delete (204) | Rate-limited per IP; writes are not saved |
  | restful-api.dev | List, get, create, replace, and delete objects | Writes are saved; built-in objects are reserved, so replace and delete need the id from create in place of `ID_FROM_CREATE`; 50 requests a day |
  | httpbin | Echo GET, POST, PUT, DELETE; status 418 | Shows the request it received |
  | Swagger Petstore | Find, add, get, update, and delete pet 20261004 | Shared and public; may be reset; never send personal data |
  | PokeAPI | Pikachu, the first five Pokémon, a type, a berry | Read-only: GET only |
- Sending disables the button ("Sending…") until the request finishes.
- A completed request shows its status, body, and headers in the **Response** section, whatever the status; 4xx and 5xx are shown, not treated as errors. A status line announces "Received HTTP <status>." without moving focus. While a new request runs, the previous response stays, dimmed.
- A failed request (invalid URL, network error, CORS rejection, timeout) shows a message and clears the previous response.
- Changing the method clears the message. Leaving the screen cancels a running request.

## UI & Navigation

- Entry point: **HTTP Client** → **fetch** (`/httpClient/fetch`).
- Three cards, laid out like an API client. When the content pane is at least 56 rem wide, **Request** and **Response** sit side by side; **Code** spans the width below. Narrower panes stack them.
- **Request** card: a **Method** dropdown (`GET`, `POST`, `PUT`, `DELETE`) and the **URL** on one row; for `POST` and `PUT` a **Body (JSON)** field with a **Format** button (enabled for valid JSON) and a hint when the text is not JSON, otherwise "<METHOD> requests have no body."; **Send** (disabled while sending or when the URL is empty); and **Examples from**, a menu of APIs with the chosen API's description, docs link, and one button per example showing its method.
- **Response** card: a status badge with the reason phrase (for example "201 Created"; green for 2xx, red for 4xx and 5xx), the time in milliseconds and the body size, then **Body** and **Headers** tabs (the headers tab shows their count). Before the first request it shows an empty state; while sending, a spinner or the dimmed previous response; on failure, "The request failed" with the reason.
- **Code** card: tabs **This request** (a `fetch` call that follows the form as it is edited) and **fetchRepository.ts** (the file's source).
- Tabs follow the WAI-ARIA pattern: arrow keys, Home, and End move between them.

## Rules & Constraints

- Only `http` and `https` URLs are accepted; surrounding whitespace is ignored.
- Requests time out after 15 seconds.
- Requests send `Accept: application/json`; `POST` and `PUT` also send `Content-Type: application/json; charset=utf-8` and the payload when it is not blank.
- URLs, payloads, bodies, and headers are never logged.

## Platform limitations

- The browser enforces CORS: a response can only be read when the server allows this site, and a CORS rejection looks the same as a network error.
- Only response headers the server exposes are visible, so the list is often shorter than in a native app.
- The response is not kept across a reload; an old `/httpClient/fetch/response` link opens the form.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| FET-AC-01 | Send the default `GET` | The Response section on the same page shows 200, formatted JSON, and headers. |
| FET-AC-02 | Enter `example.com` and send | A message asks for a valid http:// or https:// URL; no request is made. |
| FET-AC-03 | Clear the URL | **Send** is disabled. |
| FET-AC-04 | Select `POST` | The Body (JSON) field appears; typing invalid JSON shows the hint and disables Format. |
| FET-AC-05 | The server returns 404 | The badge reads "404 Not Found" in the error colour. |
| FET-AC-06 | Go offline and send | The Response card shows "The request failed" with a message about the network and CORS. |
| FET-AC-07 | Choose **Create a post**, then send | `POST` is selected, the payload is filled, and the response shows 201 with `"id": 101`. |
| FET-AC-08 | Choose **Delete a post**, then send | `DELETE` is selected, the payload field is hidden, and the response shows 200 with `{}`. |
| FET-AC-11 | Choose ReqRes, then **Delete a user (204)**, and send | The badge reads "204 No Content" and the body "(empty body)". |
| FET-AC-12 | Choose restful-api.dev, send **Create an object**, paste its id into **Replace your object**, and send | The object is replaced (200); with `ID_FROM_CREATE` left in, the API answers with an error. |
| FET-AC-13 | Choose PokeAPI | Only GET examples are offered. |
| FET-AC-09 | Edit the method, URL, or payload | "This request" shows the matching `fetch` call. |
| FET-AC-10 | Open the **fetchRepository.ts** code tab | It shows `executeRequest` from `fetchRepository.ts`. |

## Technical implementation constraints

- Source lives in `src/features/httpclient/fetch/`.
- The screen calls only `executeRequest` and keeps the response in its own state.
- No new dependencies.

## Related documents

- [Detailed design](fetch_detail_design.md)
- [Application architecture](../../../../architecture/application.md)
