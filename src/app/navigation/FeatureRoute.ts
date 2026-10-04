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
  'fetch',
  'browserInfo',
] as const

export type FeatureRoute = (typeof featureRoutes)[number]

export function isFeatureRoute(value: string): value is FeatureRoute {
  return (featureRoutes as readonly string[]).includes(value)
}

/** A screen pushed on top of a feature inside the feature pane: `/<category>/<route>/<detail>`. */
export const detailRoutes = ['response'] as const

export type DetailRoute = (typeof detailRoutes)[number]
