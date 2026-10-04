import { Navigate, Route, Routes, useParams } from 'react-router'
import { ColorSchemeToggle } from '@/common/theme/ColorSchemeToggle'
import { FeatureDestination } from './FeatureDestination'
import { CategorySidebar } from './navigation/CategorySidebar'
import { FeatureCatalogScreen } from './navigation/FeatureCatalogScreen'
import { type FeatureRoute, isFeatureRoute } from './navigation/FeatureRoute'
import { findCategory, findTopic, navigationMenu, type NavigationCategory } from './navigation/NavigationMenu'
import { NavigationPane, NavigationPlaceholder } from './navigation/NavigationPane'
import { DesktopSidebar } from './navigation/DesktopSidebar'
import { paneLayout, useFinePointer, useWindowWidth } from './navigation/paneLayout'

/**
 * The app's navigation: categories, catalogue, and feature. The URL is the selection
 * (`/`, `/<category>`, `/<category>/<route>`), so every screen can be
 * linked and the browser's Back button moves up one level. Wide touch screens show the levels side by side;
 * wide windows with a mouse show a tree sidebar next to the content.
 */
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

function Panes() {
  const params = useParams()
  const layout = paneLayout(useWindowWidth(), useFinePointer())

  // An unknown category or topic, or extra path segments, fall back to the nearest valid level.
  const category = findCategory(params.categoryId)
  if (params.categoryId !== undefined && category === undefined) return <Navigate to="/" replace />
  const route = params.route
  const selectedRoute: FeatureRoute | undefined =
    route !== undefined && isFeatureRoute(route) && category?.topics.some((topic) => topic.route === route) ? route : undefined
  if (category !== undefined && route !== undefined && selectedRoute === undefined) {
    return <Navigate to={`/${category.id}`} replace />
  }
  if (selectedRoute !== undefined && params['*']) {
    return <Navigate to={`/${category!.id}/${selectedRoute}`} replace />
  }

  const sidebar = (className?: string) => (
    <NavigationPane title="GJP Lab" className={className} headerAction={<ColorSchemeToggle />}>
      <CategorySidebar categories={navigationMenu.categories} selectedCategoryId={category?.id} />
    </NavigationPane>
  )

  // Beside the desktop tree the content pane is large, so its content may grow wider.
  const isWide = layout === 'sidebar'

  const catalog = (shown: NavigationCategory, showBack: boolean, className?: string) => (
    <NavigationPane title={shown.title} backTo={showBack ? '/' : undefined} className={className} isWide={isWide}>
      <FeatureCatalogScreen category={shown} selectedRoute={selectedRoute} />
    </NavigationPane>
  )

  const feature = (shown: FeatureRoute, showBack: boolean, className?: string) => (
    <NavigationPane title={findTopic(shown)?.title ?? shown} backTo={showBack ? `/${category!.id}` : undefined} className={className} isWide={isWide}>
      <FeatureDestination route={shown} />
    </NavigationPane>
  )

  const featureOrPlaceholder = (className: string) => {
    if (selectedRoute !== undefined) return feature(selectedRoute, false, className)
    return <NavigationPlaceholder text={category === undefined ? 'Choose a category' : 'Choose a topic'} className={className} />
  }

  const divider = <div className="w-px shrink-0 bg-outline-variant" aria-hidden="true" />

  // Desktop: the tree lists every topic, so the content pane shows the feature, or the catalogue's overview.
  if (layout === 'sidebar') {
    return (
      <div className="flex h-full">
        <DesktopSidebar categories={navigationMenu.categories} selectedCategoryId={category?.id} selectedRoute={selectedRoute} />
        {divider}
        {selectedRoute !== undefined
          ? feature(selectedRoute, false, 'flex-1')
          : category !== undefined
            ? catalog(category, false, 'flex-1')
            : <NavigationPlaceholder text="Choose a topic" className="flex-1" />}
      </div>
    )
  }

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
