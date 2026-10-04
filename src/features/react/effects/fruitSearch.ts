const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear', 'Plum']

/** The fruit whose name contains `query`, ignoring case and surrounding spaces; every fruit for an empty query. */
export function searchFruits(query: string): string[] {
  const needle = query.trim().toLowerCase()
  return fruits.filter((fruit) => fruit.toLowerCase().includes(needle))
}
