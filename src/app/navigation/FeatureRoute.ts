/**
 * Every implemented topic. The value is the `route` string in navigation.json and the last part of the
 * topic's URL (`/<category id>/<route>`).
 */
export const featureRoutes = [
  'typescriptBasics',
  'typescriptNullish',
  'typescriptCollections',
  'typescriptFunctions',
  'typescriptClasses',
  'typescriptGenerics',
  'typescriptErrors',
  'typescriptPromises',
  'typescriptIterators',
  'typescriptStrings',
  'reactComponents',
  'reactState',
  'reactEffects',
  'reactLists',
  'reactForms',
  'reactContext',
  'reactRefs',
  'reactSuspense',
  'reactTransitions',
  'reactAccessibility',
  'fetch',
  'axios',
  'hideContent',
  'csp',
  'clipboard',
  'browserInfo',
] as const

export type FeatureRoute = (typeof featureRoutes)[number]

export function isFeatureRoute(value: string): value is FeatureRoute {
  return (featureRoutes as readonly string[]).includes(value)
}
