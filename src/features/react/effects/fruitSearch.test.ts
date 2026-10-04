import { describe, expect, it } from 'vitest'
import { searchFruits } from './fruitSearch'

describe('searchFruits', () => {
  it('matches part of a name, ignoring case and spaces', () => {
    expect(searchFruits(' AP ')).toEqual(['Apple', 'Apricot', 'Grape'])
  })

  it('returns every fruit for an empty query and none for no match', () => {
    expect(searchFruits('')).toHaveLength(12)
    expect(searchFruits('kiwi')).toEqual([])
  })
})
