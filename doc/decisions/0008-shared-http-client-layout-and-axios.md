# 0008: The HTTP client topics share one layout; axios is the first runtime library

Status: Accepted, 2026-10-04. Extends [0001](0001-flat-feature-folders.md).

## Context

The fetch topic grew a request form, examples from seven APIs, a response view, and a code view. The axios topic needs the same page with a different client underneath. Copying the page would double the code and let the two topics drift apart, which defeats the comparison. axios is also the first runtime dependency beyond React and React Router, and its npm account was compromised in March 2026 (versions 1.14.1 and 0.30.4 shipped malware).

## Decision

- Code that both HTTP client topics use lives in `src/features/httpclient/shared/`: `HttpClientScreen` (the Request, Response, and Code cards), `HttpResponseView`, `exampleApis`, `HttpResponse`, `jsonPayload`, and `httpRequest` (URL validation, JSON headers and body, formatting, error messages, snippet helpers). It is one flat folder, like a feature, with tests beside the code.
- Each topic folder keeps only what differs: its repository (`fetchRepository`, `axiosRepository`), its snippet builder, and a thin screen that passes an `HttpClient` to `HttpClientScreen`.
- `axios` is added as an exact version (`1.20.0`), installed with `--ignore-scripts`, after checking that the version is not one of the compromised ones, that its dependencies match the published list, and that `npm audit signatures` passes. It is imported only by the axios topic, so it loads in that topic's chunk.

## Consequences

- A change to the layout or the examples reaches both topics; each topic's tests cover its own client, and `HttpClientScreen.test.tsx` covers the layout with a fake client.
- A category folder may hold a `shared/` folder for code its features share. Code used across categories still belongs in `src/common/`.
- Updating axios is a deliberate change: check the release and its dependencies, keep the exact version, and run `npm audit signatures`.

Related: the iOS lab compares URLSession with Alamofire in the same way.
