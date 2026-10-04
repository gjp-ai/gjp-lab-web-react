import { lazy, Suspense, type ComponentType } from 'react'
import type { FeatureRoute } from './navigation/FeatureRoute'

// Each feature is a separate chunk, loaded the first time its topic is opened. Screens take no props here;
// a few have optional props that only tests set (for example a shorter simulated delay).
const screens: Record<FeatureRoute, ComponentType> = {
  typescriptBasics: lazy(() => import('@/features/typescript/basics/BasicsScreen').then((m) => ({ default: m.BasicsScreen }))),
  typescriptNullish: lazy(() => import('@/features/typescript/nullish/NullishScreen').then((m) => ({ default: m.NullishScreen }))),
  typescriptCollections: lazy(() => import('@/features/typescript/collections/CollectionsScreen').then((m) => ({ default: m.CollectionsScreen }))),
  typescriptFunctions: lazy(() => import('@/features/typescript/functions/FunctionsScreen').then((m) => ({ default: m.FunctionsScreen }))),
  typescriptClasses: lazy(() => import('@/features/typescript/classes/ClassesScreen').then((m) => ({ default: m.ClassesScreen }))),
  typescriptGenerics: lazy(() => import('@/features/typescript/generics/GenericsScreen').then((m) => ({ default: m.GenericsScreen }))),
  typescriptErrors: lazy(() => import('@/features/typescript/errors/ErrorsScreen').then((m) => ({ default: m.ErrorsScreen }))),
  typescriptPromises: lazy(() => import('@/features/typescript/promises/PromisesScreen').then((m) => ({ default: m.PromisesScreen }))),
  typescriptIterators: lazy(() => import('@/features/typescript/iterators/IteratorsScreen').then((m) => ({ default: m.IteratorsScreen }))),
  typescriptStrings: lazy(() => import('@/features/typescript/strings/StringsScreen').then((m) => ({ default: m.StringsScreen }))),
  reactComponents: lazy(() => import('@/features/react/components/ComponentsScreen').then((m) => ({ default: m.ComponentsScreen }))),
  reactState: lazy(() => import('@/features/react/state/StateScreen').then((m) => ({ default: m.StateScreen }))),
  reactEffects: lazy(() => import('@/features/react/effects/EffectsScreen').then((m) => ({ default: m.EffectsScreen }))),
  reactLists: lazy(() => import('@/features/react/lists/ListsScreen').then((m) => ({ default: m.ListsScreen }))),
  reactForms: lazy(() => import('@/features/react/forms/FormsScreen').then((m) => ({ default: m.FormsScreen }))),
  reactContext: lazy(() => import('@/features/react/context/ContextScreen').then((m) => ({ default: m.ContextScreen }))),
  reactRefs: lazy(() => import('@/features/react/refs/RefsScreen').then((m) => ({ default: m.RefsScreen }))),
  reactSuspense: lazy(() => import('@/features/react/suspense/SuspenseScreen').then((m) => ({ default: m.SuspenseScreen }))),
  reactTransitions: lazy(() => import('@/features/react/transitions/TransitionsScreen').then((m) => ({ default: m.TransitionsScreen }))),
  reactAccessibility: lazy(() => import('@/features/react/accessibility/AccessibilityScreen').then((m) => ({ default: m.AccessibilityScreen }))),
  fetch: lazy(() => import('@/features/httpclient/fetch/FetchScreen').then((m) => ({ default: m.FetchScreen }))),
  axios: lazy(() => import('@/features/httpclient/axios/AxiosScreen').then((m) => ({ default: m.AxiosScreen }))),
  hideContent: lazy(() => import('@/features/security/hidecontent/HideContentScreen').then((m) => ({ default: m.HideContentScreen }))),
  csp: lazy(() => import('@/features/security/csp/CspScreen').then((m) => ({ default: m.CspScreen }))),
  clipboard: lazy(() => import('@/features/security/clipboard/ClipboardScreen').then((m) => ({ default: m.ClipboardScreen }))),
  browserInfo: lazy(() => import('@/features/others/browserinfo/BrowserInfoScreen').then((m) => ({ default: m.BrowserInfoScreen }))),
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

function Loading() {
  return <p className="px-5 text-on-surface-variant">Loading…</p>
}
