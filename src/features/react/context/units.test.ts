import { describe, expect, it } from 'vitest'
import { formatDistance } from './units'

describe('formatDistance', () => {
  it('shows kilometres or miles with one decimal place', () => {
    expect(formatDistance(5, 'metric')).toBe('5.0 km')
    expect(formatDistance(42.195, 'imperial')).toBe('26.2 mi')
  })
})
