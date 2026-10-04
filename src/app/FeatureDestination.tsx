import { lazy, Suspense, type ComponentType } from 'react'
import type { HttpResponse } from '@/features/httpclient/fetch/HttpResponse'
import type { FeatureRoute } from './navigation/FeatureRoute'

/** What a feature can push on top of itself inside the feature pane. */
export interface FeatureNavigation {
  /** Opens the response screen for a completed HTTP request. */
  showResponse: (response: HttpResponse) => void
}

// Each feature is a separate chunk, loaded the first time its topic is opened.
const screens: Record<FeatureRoute, ComponentType<{ navigation: FeatureNavigation }>> = {
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
  fetch: lazy(() => import('@/features/httpclient/fetch/FetchScreen').then((m) => ({ default: m.FetchScreen }))),
  browserInfo: lazy(() => import('@/features/others/browserinfo/BrowserInfoScreen').then((m) => ({ default: m.BrowserInfoScreen }))),
}

const HttpResponseScreen = lazy(() =>
  import('@/features/httpclient/fetch/HttpResponseScreen').then((m) => ({ default: m.HttpResponseScreen })),
)

/** The one place that maps a `FeatureRoute` to its screen. */
export function FeatureDestination({ route, navigation }: { route: FeatureRoute; navigation: FeatureNavigation }) {
  const Screen = screens[route]
  return (
    <Suspense fallback={<Loading />}>
      <Screen navigation={navigation} />
    </Suspense>
  )
}

/** The pushed response screen (`/<category>/fetch/response`). */
export function ResponseDestination({ response }: { response: HttpResponse }) {
  return (
    <Suspense fallback={<Loading />}>
      <HttpResponseScreen response={response} />
    </Suspense>
  )
}

function Loading() {
  return <p className="px-5 text-on-surface-variant">Loading…</p>
}
