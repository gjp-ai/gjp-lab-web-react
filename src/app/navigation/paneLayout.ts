import { useEffect, useState } from 'react'

/** How many panes `ContentView` shows side by side. */
export type PaneLayout = 'single' | 'two' | 'three'

/**
 * Picks the layout from the window width, using the same breakpoints as the Android lab: one stack
 * below 840 px, two panes from 840 px, three from 1200 px.
 */
export function paneLayout(windowWidth: number): PaneLayout {
  if (windowWidth >= 1200) return 'three'
  if (windowWidth >= 840) return 'two'
  return 'single'
}

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
