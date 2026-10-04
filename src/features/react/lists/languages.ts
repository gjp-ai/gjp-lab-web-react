export interface Language {
  id: string
  name: string
  /** The year the language first appeared. */
  year: number
}

export const languages: readonly Language[] = [
  { id: 'c', name: 'C', year: 1972 },
  { id: 'python', name: 'Python', year: 1991 },
  { id: 'java', name: 'Java', year: 1995 },
  { id: 'javascript', name: 'JavaScript', year: 1995 },
  { id: 'csharp', name: 'C#', year: 2000 },
  { id: 'go', name: 'Go', year: 2009 },
  { id: 'rust', name: 'Rust', year: 2010 },
  { id: 'kotlin', name: 'Kotlin', year: 2011 },
  { id: 'typescript', name: 'TypeScript', year: 2012 },
  { id: 'swift', name: 'Swift', year: 2014 },
]

export type LanguageSort = 'year' | 'name'

/**
 * The languages whose name contains `query` (ignoring case), sorted by year (then name) or by name.
 * Returns a new array and leaves `list` unchanged.
 */
export function visibleLanguages(list: readonly Language[], query: string, sort: LanguageSort): Language[] {
  const needle = query.trim().toLowerCase()
  const byName = (a: Language, b: Language) => a.name.localeCompare(b.name)
  return list
    .filter((language) => language.name.toLowerCase().includes(needle))
    .toSorted(sort === 'name' ? byName : (a, b) => a.year - b.year || byName(a, b))
}
