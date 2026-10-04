import { useEffect, useState } from 'react'

/** How `ContentView` arranges the navigation: the touch pane layouts, or one tree sidebar for a mouse. */
export type PaneLayout = 'single' | 'two' | 'three' | 'sidebar'

/** Matches a mouse or trackpad as the primary pointer: desktop browsers, not phones or tablets. */
export const finePointerQuery = '(hover: hover) and (pointer: fine)'

/**
 * Picks the layout from the window width and the primary pointer. Below 840 px every window shows one
 * level at a time. Wider touch screens use the Android lab's panes (two from 840 px, three from 1200 px);
 * wider windows with a mouse use one tree sidebar next to the content, as desktop docs sites do.
 */
export function paneLayout(windowWidth: number, hasFinePointer: boolean): PaneLayout {
  if (windowWidth < 840) return 'single'
  if (hasFinePointer) return 'sidebar'
  return windowWidth >= 1200 ? 'three' : 'two'
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

/** Whether the primary pointer is a mouse or trackpad; updates if it changes (for example a tablet docked to a keyboard). */
export function useFinePointer(): boolean {
  const [matches, setMatches] = useState(() => readFinePointer())
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(finePointerQuery)
    const onChange = () => setMatches(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return matches
}

// jsdom has no matchMedia; treat that environment as touch so tests opt in to the desktop layout.
function readFinePointer(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(finePointerQuery).matches
}
