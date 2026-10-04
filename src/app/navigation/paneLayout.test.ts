import { describe, expect, it } from 'vitest'
import { paneLayout } from './paneLayout'

describe('paneLayout', () => {
  it('uses one stack on narrow windows, with any pointer', () => {
    expect(paneLayout(360, false)).toBe('single')
    expect(paneLayout(839, false)).toBe('single')
    expect(paneLayout(839, true)).toBe('single')
  })

  it('shows two panes from 840 px on a touch screen', () => {
    expect(paneLayout(840, false)).toBe('two')
    expect(paneLayout(1199, false)).toBe('two')
  })

  it('shows three panes from 1200 px on a touch screen', () => {
    expect(paneLayout(1200, false)).toBe('three')
    expect(paneLayout(1920, false)).toBe('three')
  })

  it('shows the tree sidebar from 840 px with a mouse', () => {
    expect(paneLayout(840, true)).toBe('sidebar')
    expect(paneLayout(1920, true)).toBe('sidebar')
  })
})
