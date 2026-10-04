import { describe, expect, it } from 'vitest'
import { languages, visibleLanguages } from './languages'

describe('visibleLanguages', () => {
  it('filters by name, ignoring case', () => {
    expect(visibleLanguages(languages, 'SCRIPT', 'year').map((language) => language.name)).toEqual(['JavaScript', 'TypeScript'])
  })

  it('sorts by year with ties by name, or by name', () => {
    expect(visibleLanguages(languages, 'ja', 'year').map((language) => language.name)).toEqual(['Java', 'JavaScript'])
    expect(visibleLanguages(languages, '', 'name')[0].name).toBe('C')
  })

  it('leaves the original list unchanged', () => {
    const before = languages.map((language) => language.id)
    visibleLanguages(languages, '', 'name')
    expect(languages.map((language) => language.id)).toEqual(before)
  })
})
