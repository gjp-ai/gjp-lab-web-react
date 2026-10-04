# React tutorial

Learn the React features that GJPLab actually uses, one lesson at a time, with every example taken from this project's source code.

**Who this is for:** developers who can read basic TypeScript and are new to React. If union types, optional values, arrow functions, or `async`/`await` are unfamiliar, start with the [TypeScript tutorial](typescript_tutorial.md).

**How to use it:** read a lesson, open the linked file in your editor, find the snippet, then do the **Try it** exercise. Lessons build on each other, so read them in order the first time. Keep `npm run dev` running: the page updates as soon as you save a file.

**Versions:** React 19, React Router 8, Tailwind CSS 4, Vite 8, Vitest 5 with Testing Library. Lessons that rely on something new in React 19 (`ref` as a prop, ref cleanup functions, form actions, `use`) say so.

## Contents

1. [The entry point](#1-the-entry-point)
2. [Components, JSX, and props](#2-components-jsx-and-props)
3. [Showing things conditionally](#3-showing-things-conditionally)
4. [State with `useState`](#4-state-with-usestate)
5. [Events](#5-events)
6. [Lifting state up and calculating while rendering](#6-lifting-state-up-and-calculating-while-rendering)
7. [Lists and keys](#7-lists-and-keys)
8. [Effects and custom hooks](#8-effects-and-custom-hooks)
9. [Refs and the DOM](#9-refs-and-the-dom)
10. [Forms and actions](#10-forms-and-actions)
11. [Context](#11-context)
12. [Suspense, lazy loading, and transitions](#12-suspense-lazy-loading-and-transitions)
13. [Routing: the URL is the navigation state](#13-routing-the-url-is-the-navigation-state)
14. [Styling with Tailwind and the Slate theme](#14-styling-with-tailwind-and-the-slate-theme)
15. [Accessibility](#15-accessibility)
16. [Testing with Vitest and Testing Library](#16-testing-with-vitest-and-testing-library)

[Reading path, pitfalls, and glossary](#reading-path-pitfalls-and-glossary)

---

> **Try it in the app:** the **React** category has ten live demo pages, from **Components & props** to **Accessibility & testing**, which the lessons below point to. Its source is in [`features/react/`](../../src/features/react/), one folder per topic.

## Lessons

React is **declarative**: a component describes what the screen should look like for the current data, and React updates the page when that data changes. You never find an element and change its text; you change state, and the text follows.

### 1. The entry point

[`main.tsx`](../../src/main.tsx) is the first code that runs. It finds the empty `<div id="root">` in [`index.html`](../../index.html) and tells React to draw the app inside it:

```tsx
// The router works below the deployment path: a link to /react/reactState opens /lab/react/react/reactState.
// BASE_URL ends with a slash ("/lab/react/"); the basename is written without one.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- `createRoot(…).render(…)` starts React. Everything on the page from now on is drawn by components.
- **`StrictMode`** adds extra checks while developing: React renders each component twice and runs each effect's setup and cleanup one extra time, to expose code that is not safe to repeat ([lesson 8](#8-effects-and-custom-hooks)). It does nothing in a production build.
- **`BrowserRouter`** connects React to the address bar ([lesson 13](#13-routing-the-url-is-the-navigation-state)).

[`App.tsx`](../../src/app/App.tsx) is the root component. It loads the maintenance flag, then shows either the maintenance screen or `ContentView`, the navigation.

**Try it:** in [`public/remote-config.json`](../../public/remote-config.json), set `"maintenanceEnabled": true` and reload the page. The maintenance screen appears. Set it back to `false` and press **Try again**.

### 2. Components, JSX, and props

A **component** is a function that returns what to show. Its name starts with a capital letter. The HTML-like syntax is **JSX**: TypeScript turns it into function calls, and anything inside `{ }` is a TypeScript expression.

From [`ComponentsScreen.tsx`](../../src/features/react/components/ComponentsScreen.tsx):

```tsx
/** A component is a function from props to UI. */
function Greeting({ name, punctuation = '!' }: { name: string; punctuation?: string }) {
  return (
    <p className="text-lg">
      Hello, <strong>{name}</strong>
      {punctuation}
    </p>
  )
}
```

- **Props** are the component's inputs, passed like HTML attributes: `<Greeting name={name || 'stranger'} punctuation="?" />`. A quoted value is a string; `{…}` passes any expression. Props arrive as one object, which is destructured in the parameter list, with a type for each prop.
- `punctuation = '!'` gives an optional prop a default.
- JSX uses `className` instead of `class`, and `htmlFor` instead of `for`, because `class` and `for` are JavaScript keywords.
- A component returns one element. To return several without a wrapper element, use a **fragment**: `<>…</>`.

**`children` and composition.** Whatever is written between a component's opening and closing tags arrives as the `children` prop. Its type is `ReactNode`: anything React can draw. [`LabDemoSection.tsx`](../../src/common/theme/LabDemoSection.tsx) is the card used by every React topic:

```tsx
/** A titled card that groups one demo: a heading, a one-line explanation, then the live sample. */
export function LabDemoSection({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3.5 rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-1">
        {/* A real heading, so screen-reader users can jump between demos. */}
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-on-surface-variant">{caption}</p>
      </div>
      {children}
    </section>
  )
}
```

React shares layout by wrapping, not by inheritance: `LabDemoSection` does not know what it contains. Any prop can hold JSX, not only `children`: [`ContentView`](../../src/app/ContentView.tsx) passes `headerAction={<ColorSchemeToggle />}` to [`NavigationPane`](../../src/app/navigation/NavigationPane.tsx), which draws it in its header.

**Passing every other prop through.** [`LabButton.tsx`](../../src/common/theme/LabButton.tsx) accepts every attribute a `<button>` accepts, takes out the ones it handles, and passes the rest on with `...props`:

```tsx
export function LabButton({
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
```

So `<LabButton onClick={…} disabled={…} aria-label="…">` works like a normal button.

**Try it:** add a third `<Greeting>` to `ComponentsScreen` with `punctuation="!!!"`. Then try to pass `punctuation={3}`: the editor underlines it, because the prop is a `string`.

### 3. Showing things conditionally

JSX is an expression, so the usual TypeScript tools choose what to show:

| Tool | Use it for | Project example |
| --- | --- | --- |
| `if (…) return …` | Choosing a whole screen | `App` returns the loading page, the maintenance screen, or `ContentView` |
| `return null` | Showing nothing | `Badge` when the count is 0 |
| `condition && <X />` | Showing something or nothing | The **Mark all read** button in `ComponentsScreen` |
| `condition ? <A /> : <B />` | Choosing between two | Run output, or "Tap Run to see the output", in `CodeSampleCard` |

From [`App.tsx`](../../src/app/App.tsx):

```tsx
if (phase === 'checking') return <main className="h-full bg-background" aria-busy="true" aria-label="Loading GJP Lab" />
if (phase === 'maintenance') return <MaintenanceScreen onRetry={() => void retry()} isRetrying={isRetrying} />
return <ContentView />
```

And from [`ComponentsScreen.tsx`](../../src/features/react/components/ComponentsScreen.tsx):

```tsx
function Badge({ count }: { count: number }) {
  // Returning null renders nothing.
  if (count === 0) return null
  return (
    <span className="rounded-full bg-error px-2 py-0.5 text-xs font-semibold text-on-primary" aria-label={`${count} unread`}>
      {count}
    </span>
  )
}
```

Be careful with `&&` and numbers: `{count && <Badge />}` shows a literal `0` when `count` is 0, because React draws numbers. Compare explicitly: `{count > 0 && …}`.

### 4. State with `useState`

**State** is a component's memory: data that changes while the page is open. `useState` returns the current value and a function that sets a new one. Calling the setter does not change the value in place; it asks React to call the component again (**render** it) with the new value.

From [`StateScreen.tsx`](../../src/features/react/state/StateScreen.tsx):

```tsx
function CounterDemo() {
  const [count, setCount] = useState(0)

  // Each call reads the same `count` from this render, so three calls still add only one.
  const addThreeWithValue = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  // An updater function receives the latest pending value, so the three calls add three.
  const addThreeWithUpdater = () => {
    setCount((value) => value + 1)
    setCount((value) => value + 1)
    setCount((value) => value + 1)
  }
```

`count` is a constant for the whole render. To build on the previous value, pass the setter a function, as `addThreeWithUpdater` does.

**Hooks** are the functions whose names start with `use`. They must be called at the top level of a component (or of another hook), in the same order every render: never inside an `if`, a loop, or a nested function. React tells hooks apart only by their call order. `npm run lint` checks this rule (`react/rules-of-hooks` in [`.oxlintrc.json`](../../.oxlintrc.json)).

**Objects and arrays are replaced, not changed.** React compares the old and new value; if you change an object in place, it is the same object, and nothing renders. Make a copy with the change:

```tsx
const [person, setPerson] = useState<Person>({ first: 'Grace', last: 'Hopper' })
// …
onChange={(event) => setPerson({ ...person, first: event.target.value })}
```

For arrays, `[...list, entry]` adds an item and `list.filter(…)` removes some, each returning a new array, as `PropagationDemo` does with `setEvents((list) => [...list, entry])`.

**A function as the initial value** runs only on the first render. [`BrowserInfoScreen.tsx`](../../src/features/others/browserinfo/BrowserInfoScreen.tsx) reads the browser once, not on every render:

```tsx
// Read once when the screen opens; values do not update while it is shown.
const [info] = useState(() => readBrowserInfo())
```

Each component instance has its own state: every `CodeSampleCard` on a TypeScript topic page remembers its own output.

**Try it:** in the **State & events** topic, press **+3 with value** and **+3 with updater** and compare. Then, in `ObjectStateDemo`, replace the first `onChange` with `(event) => { person.first = event.target.value; setPerson(person) }` and type in the field: nothing updates. Undo it.

### 5. Events

Event handlers are props whose names start with `on`: `onClick`, `onChange`, `onSubmit`, `onBlur`, `onKeyDown`. Pass a function; do not call it. `onClick={reset}` is right, `onClick={reset()}` runs `reset` during rendering.

Most state changes start in a handler. The handler receives an event object, typed by the event and the element:

```tsx
const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
  record('button handled the click')
  if (stopsPropagation) event.stopPropagation()
}
```

`MouseEvent` here is React's type, imported from `'react'`, not the browser's. Events **bubble**: a click on the button runs its handler, then the handler of every parent element that has one. `event.stopPropagation()` stops it there. The **State & events** topic shows the difference live.

**Forms** send a `submit` event, which by default reloads the page. Call `event.preventDefault()` to handle it in React instead, as [`HttpClientScreen.tsx`](../../src/features/httpclient/shared/HttpClientScreen.tsx) does:

```tsx
<form
  aria-label="Request"
  noValidate
  className="flex flex-col gap-4"
  onSubmit={(event) => {
    event.preventDefault()
    void send()
  }}
>
```

Using a `<form>` with a submit button means pressing Enter in the URL field sends the request, with no extra code.

Events from outside React, such as a key press anywhere on the page or a window resize, are listened for in an effect ([lesson 8](#8-effects-and-custom-hooks)).

### 6. Lifting state up and calculating while rendering

**Lifting state up.** When two components must show the same data, keep the state in their nearest common parent and pass it down as props, with a callback to change it. The parent becomes the **single source of truth**.

From [`StateScreen.tsx`](../../src/features/react/state/StateScreen.tsx):

```tsx
/** The parent owns the one source of truth; both inputs are derived from it. */
function TemperatureDemo() {
  const [celsius, setCelsius] = useState(20)
  // …
  <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
  <TemperatureInput
    label="Fahrenheit"
    value={celsiusToFahrenheit(celsius)}
    onChange={(fahrenheit) => setCelsius(fahrenheitToCelsius(fahrenheit))}
  />
```

There is one temperature, in Celsius. Fahrenheit is never stored, only calculated, so the two can never disagree. The conversions live in [`temperature.ts`](../../src/features/react/state/temperature.ts), a plain module with no React in it, which makes them easy to test.

**Calculate, do not store.** Anything that can be worked out from props or state is calculated during rendering, not copied into more state. From [`EffectsScreen.tsx`](../../src/features/react/effects/EffectsScreen.tsx):

```tsx
const [first, setFirst] = useState('Katherine')
const [last, setLast] = useState('Johnson')
// Calculated while rendering: an effect that copied this into state would render twice and could fall out of date.
const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
```

The lists topic does the same with filtering and sorting ([lesson 7](#7-lists-and-keys)), and [`HttpClientScreen`](../../src/features/httpclient/shared/HttpClientScreen.tsx) builds the code snippet for the current request on every render from `method`, `url`, and `payload`.

**Try it:** add a "Kelvin" `TemperatureInput` to `TemperatureDemo`, using `celsius + 273.15` and its inverse. No new state is needed.

### 7. Lists and keys

To show a list, `map` the array to elements. Each element needs a **key**: a string or number that is unique among its siblings and stays the same for the same item, so React can match items between renders.

From [`ListsScreen.tsx`](../../src/features/react/lists/ListsScreen.tsx):

```tsx
<ul className="flex flex-col divide-y divide-outline-variant/50">
  {languages.slice(0, 4).map((language) => (
    <li key={language.id} className="flex justify-between py-2">
      <span className="font-medium">{language.name}</span>
      <span className="text-on-surface-variant">{language.year}</span>
    </li>
  ))}
</ul>
```

**Why not the index?** The **Keys keep each item's identity** demo shows two lists side by side, one with `key={index}` and one with `key={task.id}`. Type a note next to a task and add a new task at the top: with index keys, React reuses the first row (key `0`) for the new task, and the note moves to the wrong task. Use an ID from the data. An index is acceptable only when the rows hold no state of their own, such as the plain-text event logs in this project.

**Keys reset components.** A different key makes React throw away the old component and its state and create a new one. `ActionStateDemo` in [`TransitionsScreen.tsx`](../../src/features/react/transitions/TransitionsScreen.tsx) uses this to refill an input after each save:

```tsx
{/* key: the field is recreated with the action's draft after each result. */}
<input key={`${state.saved}|${state.draft}|${state.error ?? ''}`} name="name" defaultValue={state.draft} className={labInputClassName} aria-invalid={state.error !== undefined} />
```

**Filter and sort while rendering**, from a list stored once. `DerivedListDemo` calls `visibleLanguages(languages, query, sort)` on every render; `query` and `sort` are the only state.

### 8. Effects and custom hooks

An **effect** synchronises a component with something outside React: a timer, a browser event, a subscription, a network request. `useEffect(setup, dependencies)` runs `setup` after React has updated the page. If `setup` returns a function, that **cleanup** runs before the effect runs again and when the component is removed.

From [`EffectsScreen.tsx`](../../src/features/react/effects/EffectsScreen.tsx):

```tsx
function Ticker({ onLog }: { onLog: (entry: string) => void }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    onLog('setup: interval started')
    const id = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => {
      clearInterval(id)
      onLog('cleanup: interval cleared')
    }
  }, [onLog])
```

**Dependencies decide when it runs.** The array lists every prop, state value, or function from the component that the effect reads:

| Dependencies | The effect runs |
| --- | --- |
| `[]` | Once, after the first render (cleanup when the component is removed) |
| `[query, delayMs]` | After the first render, and again when `query` or `delayMs` changes |
| *(no array)* | After every render |

The search demo uses cleanup to **debounce**: each keystroke changes `query`, which clears the previous timer and starts a new one, so only the last keystroke searches:

```tsx
useEffect(() => {
  const id = setTimeout(() => {
    setResults(searchFruits(query))
    setLog((list) => [...list.slice(-5), `searched for "${query}"`])
  }, delayMs)
  return () => clearTimeout(id)
}, [query, delayMs])
```

**Stable functions with `useCallback`.** A function created during rendering is a new function every time, so an effect that depends on it would run after every render. `TimerDemo` wraps `record` in `useCallback(…, [])`, so the `Ticker` effect runs only when the ticker appears.

**Ignoring a result that arrives too late.** When an effect starts async work, the component may be gone (or the inputs may have changed) before the result arrives. [`App.tsx`](../../src/app/App.tsx) and [`CodeSampleCard.tsx`](../../src/common/codesample/CodeSampleCard.tsx) use an `isCurrent` flag that the cleanup clears:

```tsx
useEffect(() => {
  let isCurrent = true
  void loadMaintenanceMode().then((maintenanceEnabled) => {
    if (isCurrent) setPhase(maintenanceEnabled ? 'maintenance' : 'app')
  })
  return () => {
    isCurrent = false
  }
}, [loadMaintenanceMode])
```

**You might not need an effect.** Effects are for systems outside React. Values calculated from state belong in rendering ([lesson 6](#6-lifting-state-up-and-calculating-while-rendering)), and work caused by a click belongs in the click handler: `CodeSampleCard` clears the old output in the **Run** button's `onClick`, not in an effect.

**Custom hooks** move an effect and its state into a function whose name starts with `use`, so components can share it. From [`paneLayout.ts`](../../src/app/navigation/paneLayout.ts):

```tsx
/** The current window width, updated when the window is resized. */
export function useWindowWidth(): number {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}
```

The project has several more: `useFinePointer` (mouse or touch), `useColorScheme` (light or dark, saved in local storage), and `useSidebarCollapsed`.

**Try it:** open the **Effects** topic in `npm run dev` and press **Show ticker**. In development the log shows *setup, cleanup, setup*: Strict Mode runs the effect one extra time to prove the cleanup works. Now delete the `clearInterval(id)` line and show the ticker again: it counts two seconds per second, because the interval from Strict Mode's extra run is never stopped. Removing the ticker no longer stops it either; the intervals keep running in the background. Undo it.

### 9. Refs and the DOM

A **ref** is a box with a `current` property that keeps its value between renders. Unlike state, changing `ref.current` does not render again. Refs hold two kinds of things:

**DOM elements**, so you can focus, measure, or scroll them. From [`RefsScreen.tsx`](../../src/features/react/refs/RefsScreen.tsx):

```tsx
function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  // …
  <SearchField ref={inputRef} />
  <LabButton onClick={() => inputRef.current?.focus()}>Focus the field</LabButton>
```

```tsx
/** Passes the ref it receives through to its <input>. */
function SearchField({ ref }: { ref: Ref<HTMLInputElement> }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-on-surface-variant">Search the docs</span>
      <input ref={ref} type="search" defaultValue="useRef" className={labInputClassName} />
    </label>
  )
}
```

In React 19, `ref` is an ordinary prop, so `SearchField` passes it on like any other. `current` is `null` until the element is on the page, so read it with `?.`, in an event handler or effect, never during rendering.

**Values the screen does not show**, such as a timer ID or an `AbortController`. [`HttpClientScreen.tsx`](../../src/features/httpclient/shared/HttpClientScreen.tsx) keeps the controller for the request in flight, so a new request or leaving the page can cancel it:

```tsx
const controller = useRef<AbortController | null>(null)

// Leaving the screen cancels a request that is still running.
useEffect(() => () => controller.current?.abort(), [])
```

**Ref callbacks** handle a list of elements. Pass a function to `ref`; React calls it with the element, and (new in React 19) calls the function it returns when the element goes away. [`LabTabs.tsx`](../../src/common/theme/LabTabs.tsx) keeps a map of its tab buttons this way, so the arrow keys can move focus between them:

```tsx
ref={(element) => {
  if (element !== null) buttons.current.set(tab.id, element)
  return () => {
    buttons.current.delete(tab.id)
  }
}}
```

**Uncontrolled inputs.** An input without a `value` prop keeps what is typed in the browser's own element; React does not track it. `defaultValue` sets only its first value. `SearchField` above, the task notes in the keys demo, and the form-action fields ([lesson 10](#10-forms-and-actions)) work this way. To read such an input, use a ref, or the form's `FormData` on submit.

### 10. Forms and actions

**Controlled inputs** show a value from state and report every change, so React always knows what is in the form. Text fields and selects use `value`; checkboxes and radio buttons use `checked`. From [`FormsScreen.tsx`](../../src/features/react/forms/FormsScreen.tsx):

```tsx
<input value={name} onChange={(event) => setName(event.target.value)} className={labInputClassName} />
<input type="checkbox" checked={wantsNews} onChange={(event) => setWantsNews(event.target.checked)} className="size-4" />
```

**Validation.** `ValidationDemo` calculates errors from state on every render with [`validateSignUp`](../../src/features/react/forms/signUpValidation.ts), and shows a field's error only after the field has lost focus or the form has been submitted. Each message is linked to its input, so screen readers read it with the field:

```tsx
// useId gives ids that are unique on the page, to link the label, hint, and error to the input.
const id = useId()
// …
<input
  id={id}
  // …
  aria-invalid={error !== undefined}
  aria-describedby={describedBy || undefined}
```

Use `useId`, not a fixed string, for IDs: a component can appear more than once on a page. On a failed submit, the handler moves focus to the first invalid field.

**Form actions** (React 19) suit forms that are read once, on submit. Pass a function to `<form action>`; React calls it with the form's `FormData` and resets the uncontrolled fields when it finishes. No state per field is needed:

```tsx
// A form action receives the submitted FormData. React resets the uncontrolled fields when it finishes.
const submit = async (formData: FormData) => {
  setError(undefined)
  try {
    setReceipt(await sendFeedback(String(formData.get('topic')), String(formData.get('message') ?? ''), latencyMs))
  } catch (failure) {
    setReceipt(undefined)
    setError(failure instanceof Error ? failure.message : 'Sending failed.')
  }
}
// …
<form action={submit} className="flex flex-col gap-3">
```

`useFormStatus` reports whether the surrounding form is sending, so the button can disable itself. It reads the *parent* form, so it must be called in a component inside the `<form>`:

```tsx
/** useFormStatus reads the nearest parent <form>, so it must be called in a component inside it. */
function SendButton() {
  const { pending } = useFormStatus()
  return (
    <LabButton type="submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send feedback'}
    </LabButton>
  )
}
```

Two more action hooks are in [`TransitionsScreen.tsx`](../../src/features/react/transitions/TransitionsScreen.tsx):

- **`useActionState(action, initialState)`** returns the action's latest result, the action to pass to `<form action>`, and `isPending`. The action receives the previous result as its first argument, which `ActionStateDemo` uses to keep the saved name when a rename fails.
- **`useOptimistic(state, update)`** shows the expected result straight away, while the action is still running. `OptimisticDemo` adds the new message marked "Sending…"; when the action ends, React drops the optimistic version, and the real list either contains the sent message or, after a failure, does not.

**Try it:** in the **Forms** topic, submit the sign-up form empty and notice where focus goes. In the **Transitions & actions** topic, send a chat message containing "fail" to watch the optimistic message roll back.

### 11. Context

**Context** passes a value to every component below a provider, however deep, without threading it through props at each level. Use it for values many components need, such as units, the signed-in user, or a theme.

From [`ContextScreen.tsx`](../../src/features/react/context/ContextScreen.tsx):

```tsx
// The default value is used only by components with no provider above them.
const UnitsContext = createContext<Units>('metric')

// The provider: everything inside sees `units`.
<UnitsContext value={units}>
  <RunList />
</UnitsContext>

// Two levels down; RunList in between passes nothing.
function RunCard({ name, kilometres }: { name: string; kilometres: number }) {
  const units = use(UnitsContext)
  // …
}
```

- In React 19 the context object is itself the provider: `<UnitsContext value={…}>`.
- `use(UnitsContext)` reads the value from the nearest provider above. (`useContext` does the same; `use` can also be called inside an `if`.)
- When the provided value changes, every component that reads it renders again.

**Sharing state and updates.** Provide an object that holds state and the functions that change it, and wrap reading it in a custom hook that fails clearly when the provider is missing:

```tsx
const CartContext = createContext<Cart | null>(null)

/** Reads the cart, and fails loudly if a component is used outside its provider. */
function useCart(): Cart {
  const cart = use(CartContext)
  if (cart === null) throw new Error('useCart must be used inside <CartProvider>')
  return cart
}

function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const cart: Cart = { count, add: () => setCount((value) => value + 1), clear: () => setCount(0) }
  return <CartContext value={cart}>{children}</CartContext>
}
```

Context is not this project's state management: screens keep their own state with `useState`, and navigation state lives in the URL ([lesson 13](#13-routing-the-url-is-the-navigation-state)). Reach for context when passing the same prop through several layers becomes a burden.

### 12. Suspense, lazy loading, and transitions

**`lazy` and `Suspense`** split the app into files that download only when needed. Every topic in this lab is its own file. From [`FeatureDestination.tsx`](../../src/app/FeatureDestination.tsx):

```tsx
// Each feature is a separate chunk, loaded the first time its topic is opened. …
const screens: Record<FeatureRoute, ComponentType> = {
  typescriptBasics: lazy(() => import('@/features/typescript/basics/BasicsScreen').then((m) => ({ default: m.BasicsScreen }))),
  // … one line per topic
}

/** The one place that maps a `FeatureRoute` to its screen. */
export function FeatureDestination({ route }: { route: FeatureRoute }) {
  const Screen = screens[route]
  return (
    <Suspense fallback={<Loading />}>
      <Screen />
    </Suspense>
  )
}
```

`lazy` expects a module with a `default` export; the `.then(…)` adapts the named export. While the file downloads, the screen **suspends** and the nearest `<Suspense>` shows its `fallback`.

**Waiting for data with `use(promise)`.** A component can read a promise with `use`, and suspends until it resolves. From [`SuspenseScreen.tsx`](../../src/features/react/suspense/SuspenseScreen.tsx):

```tsx
function DataDemo({ latencyMs }: { latencyMs: number }) {
  // The promise is created in an event handler (or once, here) and kept in state, never created while rendering.
  const [notes, setNotes] = useState(() => loadReleaseNotes('19', latencyMs))
  // …
  <Suspense fallback={<Fallback text="Loading release notes…" />}>
    <ReleaseCard notes={notes} />
  </Suspense>
}

function ReleaseCard({ notes }: { notes: Promise<ReleaseNotes> }) {
  const release = use(notes)
  // …
}
```

Never create the promise during rendering: each render would make a new promise and suspend again, forever.

**Transitions** mark an update as not urgent. React keeps the current screen responsive and visible until the new one is ready. `useTransition` returns `isPending` and `startTransition`:

```tsx
const [isPending, startTransition] = useTransition()

const onChange = (value: string) => {
  // The field updates at once (urgent); the slow list follows when React has time.
  setQuery(value)
  if (usesTransition) startTransition(() => setFilter(value))
  else setFilter(value)
}
```

In `TransitionsScreen` the list is deliberately slow to render; the checkbox lets you feel typing with and without the transition. In `SuspenseScreen`, the same idea keeps old release notes on screen (dimmed by `isPending`) instead of replacing them with the fallback.

**`memo`** skips rendering a component when its props have not changed. `SlowList` is wrapped in `memo`, so typing (which changes only `query`) does not render the list; only `filter` changes do. Use `memo` when you have measured a slow component, not by default.

### 13. Routing: the URL is the navigation state

This lab keeps no navigation state in React: the address bar *is* the state. `/` is the home page, `/<category>` a catalogue, and `/<category>/<route>` a topic, so every screen can be bookmarked, and the browser's Back button moves up one level.

From [`ContentView.tsx`](../../src/app/ContentView.tsx):

```tsx
export function ContentView() {
  return (
    <Routes>
      <Route path="/" element={<Panes />} />
      <Route path="/:categoryId" element={<Panes />} />
      <Route path="/:categoryId/:route" element={<Panes />} />
      {/* Deeper URLs (such as the retired /<category>/fetch/response) open their topic. */}
      <Route path="/:categoryId/:route/*" element={<Panes />} />
    </Routes>
  )
}
```

- `<Routes>` picks the first `<Route>` whose `path` matches the URL.
- `:categoryId` is a **URL parameter**; `useParams()` reads it.
- `<Navigate to="…" replace />` redirects. `Panes` uses it to send an unknown category or topic to the nearest valid level; `replace` swaps the bad URL in the history instead of adding to it.
- `<Link to="…">` is an `<a>` that changes the URL without reloading the page. Every sidebar and catalogue row is a link, through [`LabListCard`](../../src/common/theme/LabListCard.tsx).

`Panes` then decides how many levels to show side by side from the window width and pointer, with [`paneLayout`](../../src/app/navigation/paneLayout.ts): one level on a phone, two or three on a wide touch screen, or a tree sidebar with a mouse. The sidebar and catalogue content comes from [`navigation.json`](../../src/app/navigation/navigation.json), never from component code.

**Try it:** the app is served under `/lab/react/` ([`vite.config.ts`](../../vite.config.ts)), and the router's `basename` hides that prefix from the code. Open `http://localhost:5173/lab/react/react/reactState`, then `…/lab/react/react/nowhere`: you land on the React catalogue. Make the window narrower than 840 px and watch the panes collapse into one.

### 14. Styling with Tailwind and the Slate theme

Components are styled with **Tailwind CSS** utility classes in `className`: `flex`, `gap-3`, `rounded-xl`, `px-4`, `text-sm`. There are no separate CSS files per component and no component library.

**Colours come from theme tokens, never raw values.** [`theme.css`](../../src/common/theme/theme.css) defines each colour role once, with a light and a dark value, and exposes it to Tailwind:

```css
:root {
  color-scheme: light dark;
  --lab-primary: light-dark(#000000, #ffffff);
  --lab-on-primary: light-dark(#ffffff, #000000);
  /* … */
}

@theme inline {
  --color-primary: var(--lab-primary);
  --color-on-primary: var(--lab-on-primary);
  /* … */
}
```

So `bg-primary text-on-primary` is white text on black in light mode and black text on white in dark mode, with no extra code. Always pair a background with its `on-…` colour so text stays readable. `light-dark()` follows the system setting; the [`ColorSchemeToggle`](../../src/common/theme/ColorSchemeToggle.tsx) overrides it by setting `data-theme` on `<html>`.

**Variants in an object.** [`LabButton`](../../src/common/theme/LabButton.tsx) keeps its variants' classes in a `const` object and picks one by prop: `variants[variant]`. The `keyof typeof variants` type makes an unknown variant a compile error.

**Container queries.** `@container` on an element lets its children respond to the element's width instead of the window's. The HTTP client page puts its Request and Response cards side by side with `@4xl:grid-cols-2` whenever the pane is wide enough, whether that pane is full-screen on a tablet or next to a sidebar on a desktop.

**Try it:** press the sun/moon button in the header. Then, in `LabDemoSection.tsx`, change `bg-surface` to `bg-red-500` and look at both modes: a raw colour ignores the theme. Undo it.

### 15. Accessibility

Accessible React starts with the right HTML element, adds ARIA only for what HTML cannot express, and is tested the way people use the page. The **Accessibility & testing** topic demonstrates each point.

**Semantic HTML first.** A `<button>` can be reached with Tab, pressed with Enter or Space, and is announced as a button, with no extra code. A `<div onClick>` works only with a mouse. Links are `<a>` (through `<Link>`), headings are `<h1>`–`<h3>`, label-and-value lists are `<dl>`, and every input has a `<label>`.

**ARIA for state.** [`ColorSchemeToggle`](../../src/common/theme/ColorSchemeToggle.tsx) is an icon-only button, so it needs a name, and it is a toggle, so it reports whether it is on:

```tsx
<button
  type="button"
  aria-label="Dark mode"
  aria-pressed={isDark}
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  onClick={toggle}
```

| Attribute | Meaning | Project example |
| --- | --- | --- |
| `aria-label` | A name when there is no visible text | Icon buttons, the Back link |
| `aria-pressed` | A toggle button's on or off state | `ColorSchemeToggle` |
| `aria-expanded`, `aria-controls` | Whether a button's panel is open, and which panel | `Disclosure` in `AccessibilityScreen` |
| `aria-invalid`, `aria-describedby` | A field's error state and the text that explains it | `ValidatedField` in `FormsScreen` |
| `aria-current="page"` | The selected link in a list | `LabListCard` |
| `aria-hidden="true"` | Decoration that screen readers should skip | Icons next to text |

**Live regions** announce changes that happen away from the focused control. An element with `role="status"` (or `aria-live="polite"`) is read out when its text changes. It must already be on the page before the change, so render the element always and change only its text:

```tsx
{/* Announces each result without moving focus away from the form. */}
<p role="status" className="sr-only">
  {isLoading ? 'Sending the request…' : response !== null ? `Received HTTP ${response.status}.` : ''}
</p>
```

`sr-only` hides it visually but keeps it for screen readers.

**Keyboard patterns.** [`LabTabs`](../../src/common/theme/LabTabs.tsx) follows the WAI-ARIA tabs pattern: arrow keys move between tabs, and only the selected tab is in the Tab order (`tabIndex={isSelected ? 0 : -1}`).

**Motion.** Animations use `motion-reduce:` variants, such as `motion-reduce:animate-none`, so they stop for people who ask their system for reduced motion.

**Try it:** put the mouse aside and use the whole app with Tab, Shift+Tab, Enter, Space, and the arrow keys. Then turn on VoiceOver (Cmd+F5 on a Mac) and send a request in the **fetch** topic.

### 16. Testing with Vitest and Testing Library

Tests sit next to the code they test (`StateScreen.test.tsx` beside `StateScreen.tsx`) and run with `npm test`. **Vitest** runs them in Node with **jsdom**, a simulated browser; **Testing Library** renders components and finds elements the way a person would: by role and visible name.

From [`StateScreen.test.tsx`](../../src/features/react/state/StateScreen.test.tsx):

```tsx
describe('StateScreen', () => {
  it('adds one with the value and three with the updater function', async () => {
    const user = userEvent.setup()
    render(<StateScreen />)
    await user.click(screen.getByRole('button', { name: '+3 with value' }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '+3 with updater' }))
    expect(screen.getByText('Count: 4')).toBeInTheDocument()
  })
```

- `render` draws the component; `screen` searches what is on the page.
- `getByRole('button', { name: '…' })` fails if there is no such button. A query by role and name tests accessibility as a side effect: a button that loses its label breaks the test.
- `userEvent` types and clicks like a person, firing every event a real browser would. Each call is `async`, so `await` it.
- `getBy…` throws if the element is missing, `queryBy…` returns `null` (use it to assert something is *not* there), and `findBy…` waits for something that appears later.

**Pure logic is tested without React.** Keeping calculations in plain modules (`temperature.ts`, `languages.ts`, `signUpValidation.ts`) means their tests are short and fast.

**No live network.** Code that talks to the outside world takes it as a parameter, so tests pass a fake. From [`fetchRepository.test.ts`](../../src/features/httpclient/fetch/fetchRepository.test.ts):

```ts
it('never calls the network for an invalid URL', async () => {
  const fetchImpl = vi.fn<typeof fetch>()
  await expect(executeRequest('GET', 'not a url', '', { fetchImpl })).rejects.toThrow('valid http:// or https:// URL')
  expect(fetchImpl).not.toHaveBeenCalled()
})
```

`vi.fn` creates a function that records how it was called. Screens with simulated delays take a prop such as `latencyMs` or `searchDelayMs`, and tests pass `0`, so they do not wait. Routing tests wrap the app in a `MemoryRouter` with a starting URL, as [`ContentView.test.tsx`](../../src/app/ContentView.test.tsx) does.

[`src/test/setup.ts`](../../src/test/setup.ts) runs before every test file: it adds matchers such as `toBeInTheDocument()` and unmounts everything after each test.

**Try it:** in `StateScreen.test.tsx`, change `'Count: 4'` to `'Count: 5'` and run `npm test`: read how the failure shows the page. Undo it, then run `npm run test:watch` and edit a component: the tests that cover it run again on save.

---

## Reading path, pitfalls, and glossary

### Suggested reading order

Read the source in this order; each file adds a few new React ideas.

| # | File | New ideas |
| --- | --- | --- |
| 1 | [`main.tsx`](../../src/main.tsx) and [`App.tsx`](../../src/app/App.tsx) | `createRoot`, `StrictMode`, state, an effect with cleanup, choosing a screen |
| 2 | [`LabButton.tsx`](../../src/common/theme/LabButton.tsx) and [`LabDemoSection.tsx`](../../src/common/theme/LabDemoSection.tsx) | Props, defaults, `...props`, `children` |
| 3 | [`ComponentsScreen.tsx`](../../src/features/react/components/ComponentsScreen.tsx) and [`StateScreen.tsx`](../../src/features/react/state/StateScreen.tsx) | Composition, conditional rendering, `useState`, events, lifting state up |
| 4 | [`ListsScreen.tsx`](../../src/features/react/lists/ListsScreen.tsx) and [`EffectsScreen.tsx`](../../src/features/react/effects/EffectsScreen.tsx) | Keys, derived lists, effects, cleanup, `useCallback` |
| 5 | [`paneLayout.ts`](../../src/app/navigation/paneLayout.ts) and [`colorScheme.ts`](../../src/common/theme/colorScheme.ts) | Custom hooks |
| 6 | [`ContentView.tsx`](../../src/app/ContentView.tsx) and [`FeatureDestination.tsx`](../../src/app/FeatureDestination.tsx) | Routes, URL parameters, redirects, `lazy`, `Suspense` |
| 7 | [`HttpClientScreen.tsx`](../../src/features/httpclient/shared/HttpClientScreen.tsx) | A real form, refs for cancellation, live regions, container queries |
| 8 | [`FormsScreen.tsx`](../../src/features/react/forms/FormsScreen.tsx) and [`TransitionsScreen.tsx`](../../src/features/react/transitions/TransitionsScreen.tsx) | Controlled inputs, validation, form actions, `useActionState`, `useOptimistic`, `useTransition` |
| 9 | [`ContextScreen.tsx`](../../src/features/react/context/ContextScreen.tsx), [`RefsScreen.tsx`](../../src/features/react/refs/RefsScreen.tsx), and [`SuspenseScreen.tsx`](../../src/features/react/suspense/SuspenseScreen.tsx) | Context, refs, `use(promise)` |
| 10 | [`AccessibilityScreen.tsx`](../../src/features/react/accessibility/AccessibilityScreen.tsx) and its test | Semantic HTML, ARIA, testing by role |

### Common pitfalls

| Pitfall | What happens | Do this instead |
| --- | --- | --- |
| Changing an object or array in state in place | Nothing renders | Set a new copy: `{ ...person, first }`, `[...list, item]` ([lesson 4](#4-state-with-usestate)) |
| `setCount(count + 1)` several times in a row | Adds only one | `setCount((value) => value + 1)` ([lesson 4](#4-state-with-usestate)) |
| Calling a hook inside an `if` or a loop | React mixes up state between hooks | Call hooks at the top level, every render ([lesson 4](#4-state-with-usestate)) |
| `onClick={handle()}` | Runs during rendering, not on click | `onClick={handle}` or `onClick={() => handle(x)}` ([lesson 5](#5-events)) |
| Copying calculated values into state with an effect | An extra render, and values that fall out of date | Calculate while rendering ([lesson 6](#6-lifting-state-up-and-calculating-while-rendering)) |
| `key={index}` on a list that changes order | State and typed text move to the wrong item | A stable ID from the data ([lesson 7](#7-lists-and-keys)) |
| An effect without cleanup | Timers and listeners pile up; Strict Mode shows it twice | Return a cleanup function ([lesson 8](#8-effects-and-custom-hooks)) |
| Setting state after an async effect's component is gone | Stale results overwrite newer ones | An `isCurrent` flag or an `AbortController` ([lesson 8](#8-effects-and-custom-hooks)) |
| Reading `ref.current` during rendering | `null` on the first render; out of date later | Read refs in handlers and effects ([lesson 9](#9-refs-and-the-dom)) |
| Creating a promise during rendering for `use()` | Suspends forever | Create it in a handler, or once in state ([lesson 12](#12-suspense-lazy-loading-and-transitions)) |
| Keeping the current screen in state | Links, Back, and reloads lose the place | Put it in the URL ([lesson 13](#13-routing-the-url-is-the-navigation-state)) |
| Raw colours such as `bg-white` | Breaks dark mode and the Slate look | Theme tokens such as `bg-surface` ([lesson 14](#14-styling-with-tailwind-and-the-slate-theme)) |
| `<div onClick>` as a button | Unusable with a keyboard or screen reader | `<button>` ([lesson 15](#15-accessibility)) |
| Testing by CSS class or test ID first | Tests pass while the page is inaccessible | Query by role and name ([lesson 16](#16-testing-with-vitest-and-testing-library)) |

### Glossary

| Term | Meaning |
| --- | --- |
| Component | A function that takes props and returns what to show |
| Context | A value shared with every component below a provider |
| Controlled input | An input whose value comes from state and is updated in `onChange` |
| Effect | Code that synchronises a component with something outside React, run after rendering |
| Hook | A function starting with `use` that gives a component state, effects, or other React features |
| JSX | The HTML-like syntax that describes elements in TypeScript |
| Key | A stable identity for an item in a list |
| Live region | An element whose text changes are read out by screen readers |
| Props | A component's inputs |
| Ref | A box whose `current` value survives renders without causing one |
| Render | React calling a component to find out what it should show |
| Source of truth | The one place that owns a piece of state; everything else reads it or receives it as props |
| State | A component's memory; setting it renders the component again |
| Suspend | A component pausing until code or data is ready, while `Suspense` shows a fallback |
| Transition | An update marked as not urgent, so React keeps the page responsive |

### Further reading

- [react.dev](https://react.dev/learn) — the official React guide; the "You Might Not Need an Effect" page is especially useful.
- [React Router](https://reactrouter.com/) — routes, links, and URL parameters.
- [Tailwind CSS](https://tailwindcss.com/docs) — every utility class.
- [Testing Library](https://testing-library.com/docs/queries/about) — which query to use, and why role comes first.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — keyboard and ARIA patterns such as tabs and disclosures.
- In this repository: the [TypeScript tutorial](typescript_tutorial.md), [application architecture](../architecture/application.md), [decision records](../decisions/README.md), and the feature [specs](../specs/).
