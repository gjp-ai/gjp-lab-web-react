import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router'
import type { HttpResponse } from '@/features/httpclient/fetch/HttpResponse'
import { FeatureDestination, ResponseDestination, type FeatureNavigation } from './FeatureDestination'
import { CategorySidebar } from './navigation/CategorySidebar'
import { FeatureCatalogScreen } from './navigation/FeatureCatalogScreen'
import { type FeatureRoute, isFeatureRoute } from './navigation/FeatureRoute'
import { findCategory, findTopic, navigationMenu, type NavigationCategory } from './navigation/NavigationMenu'
import { NavigationPane, NavigationPlaceholder } from './navigation/NavigationPane'
import { paneLayout, useWindowWidth } from './navigation/paneLayout'

/**
 * The app's navigation: categories, catalogue, and feature. The URL is the selection
 * (`/`, `/<category>`, `/<category>/<route>`, `/<category>/<route>/response`), so every screen can be
 * linked and the browser's Back button moves up one level. Wide windows show the levels side by side.
 */
export function ContentView() {
  return (
    <Routes>
      <Route path="/" element={<Panes />} />
      <Route path="/:categoryId" element={<Panes />} />
      <Route path="/:categoryId/:route" element={<Panes />} />
      <Route path="/:categoryId/:route/:detail" element={<Panes />} />
    </Routes>
  )
}

/** State passed with the URL when a screen is pushed (the HTTP response is too large for the URL). */
interface PushState {
  response?: HttpResponse
}

function Panes() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const layout = paneLayout(useWindowWidth())

  // An unknown category, topic, or pushed screen falls back to the nearest valid level.
  const category = findCategory(params.categoryId)
  if (params.categoryId !== undefined && category === undefined) return <Navigate to="/" replace />
  const route = params.route
  const selectedRoute: FeatureRoute | undefined =
    route !== undefined && isFeatureRoute(route) && category?.topics.some((topic) => topic.route === route) ? route : undefined
  if (category !== undefined && route !== undefined && selectedRoute === undefined) {
    return <Navigate to={`/${category.id}`} replace />
  }
  const response = (location.state as PushState | null)?.response
  if (selectedRoute !== undefined && params.detail !== undefined && (params.detail !== 'response' || response === undefined)) {
    return <Navigate to={`/${category!.id}/${selectedRoute}`} replace />
  }

  const navigation: FeatureNavigation = {
    showResponse: (pushed) => navigate(`/${category!.id}/${selectedRoute!}/response`, { state: { response: pushed } satisfies PushState }),
  }

  const sidebar = (className?: string) => (
    <NavigationPane title="GJP Lab" className={className}>
      <CategorySidebar categories={navigationMenu.categories} selectedCategoryId={category?.id} />
    </NavigationPane>
  )

  const catalog = (shown: NavigationCategory, showBack: boolean, className?: string) => (
    <NavigationPane title={shown.title} backTo={showBack ? '/' : undefined} className={className}>
      <FeatureCatalogScreen category={shown} selectedRoute={selectedRoute} />
    </NavigationPane>
  )

  // The pushed response replaces the feature in its pane; Back returns to the feature.
  const feature = (shown: FeatureRoute, showBack: boolean, className?: string) =>
    response !== undefined && params.detail === 'response' ? (
      <NavigationPane title="Response" backTo={`/${category!.id}/${shown}`} className={className}>
        <ResponseDestination response={response} />
      </NavigationPane>
    ) : (
      <NavigationPane title={findTopic(shown)?.title ?? shown} backTo={showBack ? `/${category!.id}` : undefined} className={className}>
        <FeatureDestination route={shown} navigation={navigation} />
      </NavigationPane>
    )

  const featureOrPlaceholder = (className: string) => {
    if (selectedRoute !== undefined) return feature(selectedRoute, false, className)
    return <NavigationPlaceholder text={category === undefined ? 'Choose a category' : 'Choose a topic'} className={className} />
  }

  const divider = <div className="w-px shrink-0 bg-outline-variant" aria-hidden="true" />

  if (layout === 'three') {
    return (
      <div className="flex h-full">
        {sidebar('w-80 shrink-0')}
        {divider}
        {category !== undefined ? catalog(category, false, 'w-90 shrink-0') : <NavigationPlaceholder text="Choose a category" className="w-90 shrink-0" />}
        {divider}
        {featureOrPlaceholder('flex-1')}
      </div>
    )
  }

  if (layout === 'two') {
    return (
      <div className="flex h-full">
        {category !== undefined ? catalog(category, true, 'w-90 shrink-0') : sidebar('w-90 shrink-0')}
        {divider}
        {featureOrPlaceholder('flex-1')}
      </div>
    )
  }

  if (selectedRoute !== undefined) return feature(selectedRoute, true)
  if (category !== undefined) return catalog(category, true)
  return sidebar()
}
