# TypeScript tutorial

Learn the TypeScript features that GJPLab actually uses, one lesson at a time, with every example taken from this project's source code.

**Who this is for:** developers who know basic programming (variables, functions, loops) and a little JavaScript, but are new to TypeScript.

**How to use it:** read a lesson, open the linked file in your editor, find the snippet, then do the **Try it** exercise. Lessons build on each other, so read them in order the first time. Run `npm run dev` so you can see changes in the browser, and `npx tsc -b` to see type errors without building.

**Versions:** TypeScript 6 with `strict` on, compiled for ES2023 by Vite 8. The compiler settings are explained in [lesson 14](#14-the-compiler-settings-behind-this-code).

**Next:** the [React tutorial](react_tutorial.md) builds on these lessons.

## Contents

1. [`const`, `let`, and type inference](#1-const-let-and-type-inference)
2. [Union and literal types](#2-union-and-literal-types)
3. [`null`, `undefined`, and narrowing](#3-null-undefined-and-narrowing)
4. [Interfaces and type aliases](#4-interfaces-and-type-aliases)
5. [Arrays, tuples, and records](#5-arrays-tuples-and-records)
6. [Functions](#6-functions)
7. [`as const` and types derived from values](#7-as-const-and-types-derived-from-values)
8. [Discriminated unions](#8-discriminated-unions)
9. [`unknown` and checking outside data](#9-unknown-and-checking-outside-data)
10. [Utility types and generics](#10-utility-types-and-generics)
11. [Classes and error handling](#11-classes-and-error-handling)
12. [Promises, `async`/`await`, and cancellation](#12-promises-asyncawait-and-cancellation)
13. [Modules and imports](#13-modules-and-imports)
14. [The compiler settings behind this code](#14-the-compiler-settings-behind-this-code)

[Reading path, pitfalls, and glossary](#reading-path-pitfalls-and-glossary)

---

> **Try it in the app:** the **TypeScript** category runs the ideas in these lessons as live samples: press **Run** to see real output. Its source is in [`features/typescript/`](../../src/features/typescript/), one folder per topic.

## Lessons

TypeScript is JavaScript with types. The types are checked when you build and then removed, so the browser runs plain JavaScript. A type error never reaches users: `npm run build` stops first.

### 1. `const`, `let`, and type inference

`const` declares a name that cannot be reassigned; `let` declares one that can. TypeScript works out (infers) the type from the value, so you rarely write types by hand. Use `const` unless the value must change.

From [`httpRequest.ts`](../../src/features/httpclient/shared/httpRequest.ts):

```ts
/** Requests give up after this long. */
export const requestTimeoutMs = 15_000

export const timeoutMessage = `The request timed out after ${requestTimeoutMs / 1000} seconds.`
```

- `15_000` is the number 15000; the underscore only makes it easier to read.
- Backticks make a **template literal**: `${…}` puts the value of any expression into the text.
- Hover over `requestTimeoutMs` in your editor: the type is `15000`, not just `number`. A `const` can never change, so TypeScript keeps the exact value as its type.

`let` appears where a value really changes, as in [`App.tsx`](../../src/app/App.tsx):

```ts
let isCurrent = true
void loadMaintenanceMode().then((maintenanceEnabled) => {
  if (isCurrent) setPhase(maintenanceEnabled ? 'maintenance' : 'app')
})
return () => {
  isCurrent = false
}
```

`const` stops reassignment, not change: the items of a `const` array can still be changed. [Lesson 7](#7-as-const-and-types-derived-from-values) shows how to make a value truly read-only.

**Try it:** in `httpRequest.ts`, add `requestTimeoutMs = 20_000` on a new line and run `npx tsc -b`. Read the error, then remove the line.

### 2. Union and literal types

A **union** type, written with `|`, means "one of these". A **literal** type is one exact value. Together they describe a small set of allowed values, and the compiler rejects anything else, including typos.

From [`App.tsx`](../../src/app/App.tsx):

```ts
type Phase = 'checking' | 'maintenance' | 'app'

const [phase, setPhase] = useState<Phase>('checking')
```

`setPhase('loading')` does not compile, because `'loading'` is not a `Phase`. Other examples:

| Type | File | Meaning |
| --- | --- | --- |
| `'light' \| 'dark'` | [`colorScheme.ts`](../../src/common/theme/colorScheme.ts) | `ColorScheme` |
| `'single' \| 'two' \| 'three' \| 'sidebar'` | [`paneLayout.ts`](../../src/app/navigation/paneLayout.ts) | `PaneLayout`, how many panes to show |
| `'metric' \| 'imperial'` | [`units.ts`](../../src/features/react/context/units.ts) | `Units` |
| `string \| undefined` | [`httpRequest.ts`](../../src/features/httpclient/shared/httpRequest.ts) | `requestBody` returns text, or nothing |

Inside an `if`, TypeScript **narrows** a union to the cases that are still possible. In [`colorScheme.ts`](../../src/common/theme/colorScheme.ts) a stored string becomes a `ColorScheme` only after it is checked:

```ts
const value = storage?.getItem(colorSchemeKey)
return value === 'light' || value === 'dark' ? value : undefined
```

After `value === 'light' || value === 'dark'`, the type of `value` is `'light' | 'dark'`, so it can be returned as a `ColorScheme`.

**Try it:** in `paneLayout.ts`, make `paneLayout` return `'four'` and run `npx tsc -b`. Undo it.

### 3. `null`, `undefined`, and narrowing

JavaScript has two "no value" values: `undefined` (never set, or a missing property) and `null` (deliberately empty, often from browser APIs). With `strict` on, a `string` can hold neither; you must write `string | undefined` or `string | null`, and check before use. This prevents the classic "cannot read properties of undefined" crash.

| Tool | Meaning | Project example |
| --- | --- | --- |
| `if (x === undefined) return` | Leave early; `x` has a value afterwards | `if (sample === undefined) throw …` in [`typescriptTopics.test.ts`](../../src/features/typescript/typescriptTopics.test.ts) |
| `??` | Use a fallback when the value is `null` or `undefined` | `findTopic(shown)?.title ?? shown` in [`ContentView.tsx`](../../src/app/ContentView.tsx) |
| `?.` | Read or call only if the value exists; otherwise `undefined` | `inputRef.current?.focus()` in [`RefsScreen.tsx`](../../src/features/react/refs/RefsScreen.tsx) |
| `prop?: Type` | An optional property: it may be missing | `route?: FeatureRoute` in [`NavigationMenu.ts`](../../src/app/navigation/NavigationMenu.ts) |
| `!` | "Trust me, it is there": removes `null` and `undefined` from the type, without checking | `document.getElementById('root')!` in [`main.tsx`](../../src/main.tsx) |

`??` is not the same as `||`. `||` also replaces `0`, `''`, and `false`, which are real values. [`AppConfig.ts`](../../src/common/config/AppConfig.ts) uses `??`, so only a missing setting falls back to the bundled file:

```ts
remoteConfigUrl: import.meta.env.VITE_REMOTE_CONFIG_URL ?? `${import.meta.env.BASE_URL}remote-config.json`,
```

The `!` in `main.tsx` is safe because `index.html` always contains `<div id="root">`. [`HomeScreen.tsx`](../../src/app/home/HomeScreen.tsx) also uses `!` after `findCategoryOfRoute(route)`: there, `parseNavigationMenu` has already checked that every featured route belongs to a category. Use `!` only when something else guarantees the value; otherwise check.

**Try it:** the **Null & undefined** topic runs `??` and `||` side by side. Change a sample's input in [`NullishSamples.ts`](../../src/features/typescript/nullish/NullishSamples.ts) (in both the snippet and the function) and run it again.

### 4. Interfaces and type aliases

An **interface** names the shape of an object: which properties it has and their types. TypeScript checks shapes, not names (*structural typing*): any object with the right properties fits.

From [`HttpResponse.ts`](../../src/features/httpclient/shared/HttpResponse.ts):

```ts
/** A completed response, shown under the request on the fetch page. */
export interface HttpResponse {
  status: number
  body: string
  /** Header name and value pairs, sorted by name. */
  headers: [string, string][]
  /** Time from sending the request to reading the whole body, in milliseconds. */
  durationMs: number
  /** Size of the body as received, in bytes (UTF-8). */
  sizeBytes: number
}
```

The `/** … */` comments are **TSDoc**: your editor shows them when you hover over the property.

An interface can describe functions too. [`preferenceStorage.ts`](../../src/common/config/preferenceStorage.ts) asks for only the two methods it needs, so the real `window.localStorage` fits, and so does a small fake in a test:

```ts
/** The part of `Storage` a saved preference needs, so tests can pass a fake. */
export interface PreferenceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}
```

`extends` adds properties to an existing interface. From [`TransitionsScreen.tsx`](../../src/features/react/transitions/TransitionsScreen.tsx):

```ts
interface ShownMessage extends Message {
  isSending?: boolean
}
```

**`interface` or `type`?** Both can name an object shape. This project uses `interface` for object shapes and `type` for everything an interface cannot express: unions (`type Phase = …`), function types (`type SampleLog = (line: string) => void`), and types computed from other types ([lessons 7](#7-as-const-and-types-derived-from-values) and [10](#10-utility-types-and-generics)).

**Try it:** in [`browserInfoRepository.test.ts`](../../src/features/others/browserinfo/browserInfoRepository.test.ts), remove `language` from the first fake environment and run `npx tsc -b`. The error names the missing property. Then put it back and remove `deviceMemory` instead: nothing fails, because that property is optional (`deviceMemory?: number`).

### 5. Arrays, tuples, and records

| Type | Meaning | Project example |
| --- | --- | --- |
| `string[]` | An array of strings of any length | `const [events, setEvents] = useState<string[]>([])` |
| `readonly Language[]` | An array that cannot be changed | `languages` in [`languages.ts`](../../src/features/react/lists/languages.ts) |
| `[string, string]` | A **tuple**: exactly two strings, by position | One header in `HttpResponse.headers` |
| `Record<number, string>` | An object used as a lookup table | `reasonPhrases` in [`HttpResponse.ts`](../../src/features/httpclient/shared/HttpResponse.ts) |
| `Map<number, HTMLLIElement>` | A real map with any type of key | Row elements in `RefsScreen` |
| `Set<FeatureRoute>` | Unique values | `listed` in `parseNavigationMenu` (the type is inferred from `new Set(…)`) |

Array methods return new arrays and leave the original unchanged, so they suit data that must not change. [`sortHeaders`](../../src/features/httpclient/shared/httpRequest.ts) chains spread, `map`, and `sort`:

```ts
/** Header pairs with lower-case names, sorted by name. */
export function sortHeaders(entries: Iterable<[string, string]>): [string, string][] {
  return [...entries].map(([name, value]): [string, string] => [name.toLowerCase(), value]).sort(([a], [b]) => a.localeCompare(b))
}
```

- `[...entries]` copies any iterable (such as `response.headers.entries()`) into a new array, so `sort` (which changes the array it is called on) sorts the copy.
- `([name, value])` **destructures** the tuple into two names.
- `: [string, string]` after the arrow's parameters states the return type. Without it, TypeScript would infer `string[]`, which forgets that there are exactly two items.

`visibleLanguages` in [`languages.ts`](../../src/features/react/lists/languages.ts) uses `toSorted`, the ES2023 version of `sort` that returns a sorted copy and leaves the array it is called on alone:

```ts
return list
  .filter((language) => language.name.toLowerCase().includes(needle))
  .toSorted(sort === 'name' ? byName : (a, b) => a.year - b.year || byName(a, b))
```

`list` is typed `readonly Language[]`, so the compiler stops any code from changing the shared `languages` array: a `readonly` array has no `sort`, `push`, or `splice`. `filter` returns a new, ordinary array, so the chain is allowed to sort that.

`flatMap` maps and flattens in one step. `findTopic` in [`NavigationMenu.ts`](../../src/app/navigation/NavigationMenu.ts) uses it to collect every topic from every category before searching them: `navigationMenu.categories.flatMap((category) => category.topics)`.

**Try it:** at the start of `visibleLanguages`, add `list.sort()` and run `npx tsc -b`. A `readonly` array has no `sort`. Undo it.

### 6. Functions

Function parameters always need types. The return type is usually inferred, but this project writes it on exported functions so their contract is visible. React components are the exception: they always return JSX, so their return type is left to inference.

**Default values and options objects.** [`fetchRepository.ts`](../../src/features/httpclient/fetch/fetchRepository.ts) takes the request fields as parameters, and the rarely used settings in an options object that defaults to `{}`:

```ts
export async function executeRequest(
  method: HttpMethod,
  urlText: string,
  payload: string,
  options: { signal?: AbortSignal; fetchImpl?: typeof fetch } = {},
): Promise<HttpResponse> {
```

`fetchImpl?: typeof fetch` means "a function with the same type as the browser's `fetch`". Tests pass a fake, so they never touch the network ([React tutorial, lesson 16](react_tutorial.md#16-testing-with-vitest-and-testing-library)). [`maintenanceMode.ts`](../../src/app/startup/maintenanceMode.ts) does the same with a default parameter: `fetchImpl: typeof fetch = fetch`.

**Arrow functions** are short functions, usually passed to another function: `(fruit) => fruit.toLowerCase().includes(needle)`. When the body is a single expression, its value is returned without writing `return`.

**Function types** describe a function's parameters and result. From [`CodeSample.ts`](../../src/common/codesample/CodeSample.ts):

```ts
export type SampleLog = (line: string) => void

export interface CodeSample {
  title: string
  explanation: string
  code: string
  run: (log: SampleLog) => void | Promise<void>
}
```

`run` may return nothing (`void`) or a promise of nothing, so both ordinary and `async` samples fit.

**`never`** is the type of a function that never returns normally. `fail` in [`NavigationMenu.ts`](../../src/app/navigation/NavigationMenu.ts) always throws:

```ts
const fail = (message: string): never => {
  throw new Error(`Invalid navigation.json: ${message}`)
}
```

**Try it:** the **Functions & closures** topic shows default and rest parameters, and closures that keep their own state.

### 7. `as const` and types derived from values

Sometimes a list of values must exist at run time (to loop over or check against) and also as a type. Writing both by hand lets them drift apart. Instead, write the values once with `as const` and derive the type from them.

From [`FeatureRoute.ts`](../../src/app/navigation/FeatureRoute.ts):

```ts
export const featureRoutes = [
  'typescriptBasics',
  'typescriptNullish',
  // …
  'axios',
  'browserInfo',
] as const

export type FeatureRoute = (typeof featureRoutes)[number]
```

- `as const` makes the array read-only and keeps each string as a literal type, instead of widening it to `string[]`.
- `typeof featureRoutes` is the type of that value; `[number]` reads "the type of any item", which is the union `'typescriptBasics' | 'typescriptNullish' | …`.

Add a route to the array and the `FeatureRoute` type grows with it. The same pattern makes `HttpMethod` from `httpMethods` and `CategoryIconName` from `categoryIcons`.

`keyof typeof` gives the keys of an object. From [`RefsScreen.tsx`](../../src/features/react/refs/RefsScreen.tsx):

```ts
const boxWidths = { narrow: 'w-1/3', half: 'w-1/2', full: 'w-full' } as const

const [width, setWidth] = useState<keyof typeof boxWidths>('half')   // 'narrow' | 'half' | 'full'
```

**Type predicates.** A function whose return type is `value is FeatureRoute` tells TypeScript that, when it returns `true`, the value has that type:

```ts
export function isFeatureRoute(value: string): value is FeatureRoute {
  return (featureRoutes as readonly string[]).includes(value)
}
```

`ContentView` reads a route from the URL as a plain `string`; after `isFeatureRoute(route)` it may use it as a `FeatureRoute`.

`as const` also replaces `enum` in this project, because the compiler settings forbid `enum` ([lesson 14](#14-the-compiler-settings-behind-this-code)).

**Try it:** add a misspelled route such as `'reactStat'` to `FeatureDestination.tsx`'s `screens` object and run `npx tsc -b`. The key is not a `FeatureRoute`, so it is rejected.

### 8. Discriminated unions

A **discriminated union** is a union of object types that share one property (the *discriminant*) with a different literal value in each. Checking that property narrows the object to one case, which gives access to that case's other properties.

From [`jsonPayload.ts`](../../src/features/httpclient/shared/jsonPayload.ts):

```ts
/** What the payload field holds: nothing, valid JSON (with a formatted copy), or other text. */
export type PayloadCheck = { kind: 'empty' } | { kind: 'json'; formatted: string } | { kind: 'text' }
```

Only the `'json'` case has `formatted`. [`HttpClientScreen.tsx`](../../src/features/httpclient/shared/HttpClientScreen.tsx) can read it only after checking `kind`:

```ts
onClick={() => check.kind === 'json' && onChange(check.formatted)}
disabled={check.kind !== 'json'}
```

Without the check, `check.formatted` does not compile, because `'empty'` and `'text'` have no formatted text. This is safer than an object with an optional `formatted?: string`, where nothing ties the property to the state it belongs to.

With a `switch` over the discriminant, the compiler can check that every case is handled. The **Objects, classes & enums** topic shows this pattern with an exhaustive `switch`.

**Try it:** add `| { kind: 'tooLong' }` to `PayloadCheck` and run `npx tsc -b`. Nothing fails yet, because nothing returns it. Make `checkPayload` return it for payloads over 10,000 characters, then look at how the screen should show it.

### 9. `unknown` and checking outside data

Data from outside the program (JSON, local storage, the network) has no guaranteed shape. TypeScript has two types for "anything":

- `any` turns checking off: every use compiles, and mistakes surface as crashes. This project does not use it.
- `unknown` means "not checked yet": you cannot use the value until you narrow it with `typeof`, `Array.isArray`, `instanceof`, or a comparison.

`JSON.parse` returns `any`. [`httpRequest.ts`](../../src/features/httpclient/shared/httpRequest.ts) stores the result as `unknown` straight away, so the next line must check it:

```ts
const value: unknown = JSON.parse(text)
return typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : text
```

`typeof null` is `'object'` in JavaScript, which is why `value !== null` is needed as well.

[`maintenanceMode.ts`](../../src/app/startup/maintenanceMode.ts) checks a downloaded flag the same way, and treats anything unexpected as `false`:

```ts
const body: unknown = await response.json()
return typeof body === 'object' && body !== null && (body as { maintenanceEnabled?: unknown }).maintenanceEnabled === true
```

**Type assertions** (`value as Type`) tell the compiler what a value is, without checking. Use them only after you have checked, as above. [`parseNavigationMenu`](../../src/app/navigation/NavigationMenu.ts) is a longer example: it checks every field of `navigation.json` and builds a typed `NavigationMenu`, throwing with a clear message on the first problem. The import itself is typed by the JSON's contents, but parsing it as `unknown` means a wrong route or icon is caught by a unit test instead of hiding a topic.

**Try it:** in `navigation.json`, change one topic's `"route"` to `"nowhere"`. `npx tsc -b` still passes, because to the compiler the JSON only holds strings. Now run `npm test`: `NavigationMenu.test.ts` (and every test that loads the menu) fails with the message from `parseNavigationMenu`. Undo it.

### 10. Utility types and generics

A **generic** type takes other types as parameters, in angle brackets: `Promise<HttpResponse>` is a promise of a response, `Map<number, HTMLLIElement>` maps numbers to list items, and `useState<Phase>('checking')` creates state that holds a `Phase`. You mostly *use* generics in app code; the **Interfaces & generics** topic shows how to write your own generic functions and classes.

TypeScript's built-in **utility types** are generics that build a new type from an existing one:

| Utility | What it makes | Project example |
| --- | --- | --- |
| `Record<K, V>` | An object with keys `K` and values `V` | `Record<FeatureRoute, ComponentType>` in [`FeatureDestination.tsx`](../../src/app/FeatureDestination.tsx) |
| `Partial<T>` | `T` with every property optional | `SignUpErrors` in [`signUpValidation.ts`](../../src/features/react/forms/signUpValidation.ts) |
| `Pick<T, K>` | Only the listed properties of `T` | The fake `navigator` in [`browserInfoRepository.ts`](../../src/features/others/browserinfo/browserInfoRepository.ts) |
| `ReturnType<F>` | What a function returns | `useRef<ReturnType<typeof setInterval>>` in `RefsScreen` |
| `keyof T` | The union of `T`'s property names | `keyof SignUpValues` is `'email' \| 'password'` |

`Record<FeatureRoute, …>` also makes the compiler check completeness: `FeatureDestination`'s `screens` object must have one entry for *every* route, so a new route without a screen does not compile.

Utility types combine. From [`signUpValidation.ts`](../../src/features/react/forms/signUpValidation.ts):

```ts
/** One message per invalid field; an empty object means the form can be submitted. */
export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>
```

Read it from the inside out: an object with a string for each field of `SignUpValues`, where each one may be missing.

`&` (an **intersection**) combines object types. [`browserInfoRepository.ts`](../../src/features/others/browserinfo/browserInfoRepository.ts) takes six properties of the browser's `Navigator` and adds one that only Chromium has:

```ts
navigator: Pick<Navigator, 'userAgent' | 'language' | 'onLine' | 'cookieEnabled' | 'hardwareConcurrency' | 'maxTouchPoints'> & {
  /** Chromium only; approximate RAM in GB, rounded for privacy. */
  deviceMemory?: number
}
```

**Try it:** add a third field, `name: string`, to `SignUpValues` and run `npx tsc -b`. Follow the errors: `SignUpErrors` and `keyof SignUpValues` pick up the new field automatically.

### 11. Classes and error handling

Classes appear rarely in this project: plain objects and functions do most of the work, and React components are functions. The main class is a custom error, in [`httpRequest.ts`](../../src/features/httpclient/shared/httpRequest.ts):

```ts
/** A request that could not be sent or read, with a message for the user. */
export class HttpRequestError extends Error {}
```

`extends Error` inherits the message and the stack trace. The empty body is enough: the new class exists so code can tell its errors apart with `instanceof`.

**`throw`, `try`, `catch`, and `finally`.** `parseHttpUrl` turns any bad input into one readable error. `catch` without `(error)` is allowed when the error is not needed:

```ts
export function parseHttpUrl(urlText: string): URL {
  try {
    const url = new URL(urlText.trim())
    if (url.protocol === 'http:' || url.protocol === 'https:') return url
  } catch {
    // Not a URL at all; fall through to the same message.
  }
  throw new HttpRequestError('Please enter a valid http:// or https:// URL.')
}
```

**A caught value is `unknown`.** JavaScript can throw anything, not only `Error` objects, so TypeScript types the `catch` variable as `unknown`. Check before reading `message`, as [`HttpClientScreen.tsx`](../../src/features/httpclient/shared/HttpClientScreen.tsx) does:

```ts
setErrorMessage(error instanceof Error ? error.message : 'The request failed.')
```

`finally` runs whether the `try` succeeded or threw; `HttpClientScreen` uses it to turn off the loading state in both cases (unless a newer request has already started).

**Fail open on purpose.** Some failures should not stop the app. `fetchMaintenanceMode` catches every error and returns `false`, so a broken config file never locks users out; `readSidebarCollapsed` does the same when local storage is blocked.

**Try it:** the **Error handling** topic shows custom error classes, `unknown` in `catch`, and result values as an alternative to exceptions.

### 12. Promises, `async`/`await`, and cancellation

Slow work (network, timers) returns a **promise**: a value that arrives later, or an error. An `async` function always returns a promise, and inside it `await` pauses until a promise settles, without blocking the page.

From [`fetchRepository.ts`](../../src/features/httpclient/fetch/fetchRepository.ts) (shortened):

```ts
// Stop after the timeout, or earlier if the caller cancels (for example the user leaves the screen).
const timeout = AbortSignal.timeout(requestTimeoutMs)
const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout

let response: Response
try {
  response = await (options.fetchImpl ?? fetch)(url, { method, headers: requestHeaders(method), body: requestBody(method, payload), signal })
} catch (error) {
  if (timeout.aborted) throw new HttpRequestError(timeoutMessage)
  if (options.signal?.aborted) throw error
  throw new HttpRequestError(networkFailureMessage)
}

// fetch gives the body as a stream; reading it as text waits for all of it.
const text = await response.text()
```

- An **`AbortSignal`** cancels work that has started. `AbortSignal.timeout(ms)` aborts itself after a delay; `AbortSignal.any([...])` aborts when any of its signals does.
- `let response: Response` is declared before the `try` so it can be used after it. TypeScript knows every path through `catch` throws, so `response` is always set by the time it is read.
- `fetch` resolves for every HTTP status, including 404 and 500; it rejects only when no response arrives.

**Waiting for a time.** Wrap `setTimeout` in a promise to `await` a delay, as the pretend servers in the React topics do:

```ts
await new Promise((resolve) => setTimeout(resolve, latencyMs))
```

**Starting a promise you do not await.** Sometimes code starts async work without waiting for it. A React effect's setup function cannot be `async`, because it must return a cleanup function, not a promise; so it starts the work and handles the result in `.then`. `void` marks that the promise is ignored on purpose, as in `App.tsx`: `void loadMaintenanceMode().then(…)`. Event handlers do the same: the form in `HttpClientScreen` calls `void send()`.

**Try it:** the **Promises & async/await** topic runs `Promise.all`, `Promise.allSettled`, cancellation with `AbortController`, and shows the order in which the event loop runs callbacks.

### 13. Modules and imports

Every file is a **module**. Names are private to the file unless exported, and this project uses named exports only (`export function`, `export const`), never `export default`, so a name is the same everywhere it is used.

From [`ContentView.tsx`](../../src/app/ContentView.tsx):

```ts
import { Navigate, Route, Routes, useParams } from 'react-router'
import { FeatureDestination } from './FeatureDestination'
import { type FeatureRoute, isFeatureRoute } from './navigation/FeatureRoute'
```

- A bare name (`'react-router'`) is a package from `node_modules`; a path starting with `./` is a file next to this one.
- `@/` is an alias for `src/`, set in [`vite.config.ts`](../../vite.config.ts) and `tsconfig.app.json`: `import { AppConfig } from '@/common/config/AppConfig'` works from any folder.
- `type FeatureRoute` imports a type only. Types are removed when compiling, so with `verbatimModuleSyntax` on, a type-only import must say so; the compiler tells you when it is missing.

Vite adds a few import forms that TypeScript understands through [`vite-env.d.ts`](../../src/vite-env.d.ts):

| Form | Result | Project example |
| --- | --- | --- |
| `import navigationJson from './navigation.json'` | The parsed JSON, typed by its contents | `NavigationMenu.ts` |
| `import source from './file.ts?raw'` | The file's text, as a string | `FetchScreen.tsx` shows its own repository's code |
| `import.meta.env.BASE_URL` | The deployment path, `/lab/react/` | `main.tsx`, `AppConfig.ts` |
| `import('./File')` | The module, loaded later as a separate file | `lazy(() => import(…))` in `FeatureDestination.tsx` |

`vite-env.d.ts` also declares the project's own environment variable, so `import.meta.env.VITE_REMOTE_CONFIG_URL` is typed as `string | undefined`. Without the declaration, Vite types every unlisted variable as `any`, and a misspelled name would compile:

```ts
interface ImportMetaEnv {
  /** Optional URL of the maintenance-flag JSON; defaults to the bundled public/remote-config.json. */
  readonly VITE_REMOTE_CONFIG_URL?: string
}
```

Anything in a `VITE_` variable is bundled into the page, where anyone can read it, so it must never hold a secret.

### 14. The compiler settings behind this code

[`tsconfig.app.json`](../../tsconfig.app.json) decides which code compiles. The settings that most affect how this project's code is written:

| Setting | Effect | What it means here |
| --- | --- | --- |
| `strict` | Turns on all strict checks, including `strictNullChecks` | `null` and `undefined` must be handled ([lesson 3](#3-null-undefined-and-narrowing)); caught errors are `unknown` |
| `erasableSyntaxOnly` | Allows only TypeScript syntax that can simply be deleted to leave JavaScript | No `enum`, no `namespace`, no constructor parameter properties; use `as const` objects and unions instead ([lesson 7](#7-as-const-and-types-derived-from-values)) |
| `verbatimModuleSyntax` | Imports are kept exactly as written | Type-only imports need `type` ([lesson 13](#13-modules-and-imports)) |
| `noUnusedLocals`, `noUnusedParameters` | An unused name is an error | Delete it, or start a deliberately unused parameter with `_`, as in `keyOf={(_task, index) => index}` |
| `noFallthroughCasesInSwitch` | A `case` must end with `break`, `return`, or `throw` | No accidental fall-through |
| `target` and `lib`: ES2023 | Which JavaScript features exist | `toSorted` and `Array.prototype.at` are available; newer additions such as the ES2025 `Set` methods are not |

Why `erasableSyntaxOnly`? With it, every file becomes JavaScript by simply deleting the types, so any tool can run it, including Node's built-in TypeScript support, which only deletes types. (Vite's own build can translate more, but the setting keeps the code portable.) An `enum` is more than annotation: it generates a JavaScript object, so it is rejected:

```ts
enum Planet { Mercury, Earth }   // error: not erasable

const Planet = { Mercury: 'mercury', Earth: 'earth' } as const   // what this project writes
type Planet = (typeof Planet)[keyof typeof Planet]               // 'mercury' | 'earth'
```

`npm run build` runs `tsc -b` first, so the build fails on any type error. `npm run lint` runs oxlint, which catches mistakes the type checker does not, such as unsafe optional chaining.

---

## Reading path, pitfalls, and glossary

### Suggested reading order

Read the source in this order; each file adds a few new TypeScript ideas.

| # | File | New ideas |
| --- | --- | --- |
| 1 | [`AppConfig.ts`](../../src/common/config/AppConfig.ts) and [`vite-env.d.ts`](../../src/vite-env.d.ts) | `const`, `as const` objects, `??`, `import.meta.env` |
| 2 | [`HttpResponse.ts`](../../src/features/httpclient/shared/HttpResponse.ts) | Types from `as const` arrays, interfaces, `Record`, tuples |
| 3 | [`httpRequest.ts`](../../src/features/httpclient/shared/httpRequest.ts) | Custom errors, `try`/`catch`, `unknown`, array methods |
| 4 | [`jsonPayload.ts`](../../src/features/httpclient/shared/jsonPayload.ts) | Discriminated unions |
| 5 | [`fetchRepository.ts`](../../src/features/httpclient/fetch/fetchRepository.ts) | `async`/`await`, `AbortSignal`, options objects, `typeof fetch` |
| 6 | [`FeatureRoute.ts`](../../src/app/navigation/FeatureRoute.ts) and [`NavigationMenu.ts`](../../src/app/navigation/NavigationMenu.ts) | Derived types, type predicates, checking JSON, `never` |
| 7 | [`browserInfoRepository.ts`](../../src/features/others/browserinfo/browserInfoRepository.ts) | `Pick`, intersections, a default parameter for testing, regular expressions |
| 8 | [`signUpValidation.ts`](../../src/features/react/forms/signUpValidation.ts) | `Partial`, `Record`, `keyof` |
| 9 | The TypeScript topics in [`features/typescript/`](../../src/features/typescript/) | One runnable topic per language area, from values and types to strings and regex |

### Common pitfalls

| Pitfall | What happens | Do this instead |
| --- | --- | --- |
| `any` for data you have not checked | Type errors become crashes in the browser | `unknown`, then narrow ([lesson 9](#9-unknown-and-checking-outside-data)) |
| `!` to silence a `null` error | Crash when the value really is missing | Check, use `?.`, or give a fallback with `??` ([lesson 3](#3-null-undefined-and-narrowing)) |
| `\|\|` for a default value | `0`, `''`, and `false` are replaced too | `??` ([lesson 3](#3-null-undefined-and-narrowing)) |
| `value as Type` on outside data | The compiler believes you, even when you are wrong | Check the shape first, then assert ([lesson 9](#9-unknown-and-checking-outside-data)) |
| `sort()` on shared data | Changes the original array everywhere it is used | `toSorted()`, or sort a copy ([lesson 5](#5-arrays-tuples-and-records)) |
| A list of values typed separately from the values | The list and the type drift apart | `as const`, then derive the type ([lesson 7](#7-as-const-and-types-derived-from-values)) |
| `enum` | Does not compile here | An `as const` object or a union of literals ([lesson 14](#14-the-compiler-settings-behind-this-code)) |
| Reading `error.message` in `catch` without checking | Fails when something other than an `Error` is thrown | `error instanceof Error ? error.message : …` ([lesson 11](#11-classes-and-error-handling)) |
| A secret in a `VITE_` variable | It is published inside the page | Keep secrets on a server ([lesson 13](#13-modules-and-imports)) |

### Glossary

| Term | Meaning |
| --- | --- |
| Discriminated union | A union of object types told apart by one shared literal property, such as `kind` |
| Generic | A type or function with type parameters, such as `Promise<T>` |
| Inference | TypeScript working out a type from the value, so you do not write it |
| Interface | A named object shape |
| Literal type | A type with exactly one value, such as `'dark'` or `15000` |
| Narrowing | TypeScript reducing a union inside a check, such as `if (x !== undefined)` |
| Structural typing | Types match by shape, not by name |
| Tuple | An array with a fixed length and a type per position, such as `[string, string]` |
| Type assertion | `value as Type`: telling the compiler a type without a check |
| Type predicate | A return type such as `value is FeatureRoute`, which narrows the argument when the function returns `true` |
| Union | A type that is one of several, written `A \| B` |
| `unknown` | A value of any type that must be checked before it is used |

### Further reading

- [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — the official guide.
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/) — every compiler setting in `tsconfig.app.json`.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — the JavaScript underneath, including promises and modules.
- Next in this repository: the [React tutorial](react_tutorial.md).
