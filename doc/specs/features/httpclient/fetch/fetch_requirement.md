# Feature: fetch

Status: Implemented

## Goal

Let a developer build and send an HTTP request with the browser's native `fetch` API and inspect the response, as a learning sample for the HTTP Client category.

## Scope

### In scope

- Choose a method, enter a URL, and optionally a JSON payload.
- Send the request and show the status, body, and readable headers on a separate screen.
- A clear, dismissible message when the request cannot be sent or read.

### Out of scope

- Authentication, custom headers, cookies, and request history.
- Third-party HTTP libraries (planned topic: axios).
- Uploads and streaming.

## Behavior

- The screen opens with `GET` and a working sample URL.
- Sending disables the button ("Sending…") until the request finishes.
- A completed request opens the response screen at `/httpClient/fetch/response`, whatever the status; 4xx and 5xx are shown, not treated as errors.
- A failed request (invalid URL, network error, CORS rejection, timeout) stays on the form and shows a message.
- Changing the method clears the message. Leaving the screen cancels a running request.

## UI & Navigation

- Entry point: **HTTP Client** → **fetch** (`/httpClient/fetch`).
- Form: method radio group (`GET`, `POST`, `PUT`, `DELETE`), URL, payload (only for `POST` and `PUT`), and **Send request** (disabled while sending or when the URL is empty).
- Response screen: status (coloured and readable as a number), body (pretty-printed when JSON), and headers sorted by name. Back returns to the form.

## Rules & Constraints

- Only `http` and `https` URLs are accepted; surrounding whitespace is ignored.
- Requests time out after 15 seconds.
- Requests send `Accept: application/json`; `POST` and `PUT` also send `Content-Type: application/json; charset=utf-8` and the payload when it is not blank.
- URLs, payloads, bodies, and headers are never logged.

## Platform limitations

- The browser enforces CORS: a response can only be read when the server allows this site, and a CORS rejection looks the same as a network error.
- Only response headers the server exposes are visible, so the list is often shorter than in a native app.
- A reload keeps the response screen in the same tab; a copied `/response` link opens the form instead.

## Acceptance criteria

| ID | Scenario | Expected result |
| --- | --- | --- |
| FET-AC-01 | Send the default `GET` | The response screen shows 200, formatted JSON, and headers. |
| FET-AC-02 | Enter `example.com` and send | A message asks for a valid http:// or https:// URL; no request is made. |
| FET-AC-03 | Clear the URL | **Send request** is disabled. |
| FET-AC-04 | Select `POST` | The payload field appears. |
| FET-AC-05 | The server returns 404 | The response screen shows 404 in the error colour. |
| FET-AC-06 | Go offline and send | A message mentions the network and CORS and can be dismissed. |

## Technical implementation constraints

- Source lives in `src/features/httpclient/fetch/`.
- The screen calls only `executeRequest`; it pushes the response through `FeatureNavigation.showResponse`.
- No new dependencies.

## Related documents

- [Detailed design](fetch_detail_design.md)
- [Application architecture](../../../../architecture/application.md)
