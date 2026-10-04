import { describe, expect, it } from 'vitest'
import { paneLayout } from './paneLayout'

describe('paneLayout', () => {
  it('uses one stack on narrow windows', () => {
    expect(paneLayout(360)).toBe('single')
    expect(paneLayout(839)).toBe('single')
  })

  it('shows two panes from 840 px', () => {
    expect(paneLayout(840)).toBe('two')
    expect(paneLayout(1199)).toBe('two')
  })

  it('shows three panes from 1200 px', () => {
    expect(paneLayout(1200)).toBe('three')
    expect(paneLayout(1920)).toBe('three')
  })
})
