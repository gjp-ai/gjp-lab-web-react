import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Arrays, sets & maps topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const collectionsSamples: CodeSample[] = [
  {
    title: 'Arrays',
    explanation: 'toSorted and spread make new arrays and leave the original alone; sort and push change it in place.',
    code: `const languages = ['Rust', 'TypeScript', 'C']
log(\`sorted: \${languages.toSorted().join(', ')}\`)
const editable = [...languages, 'Swift']
log(\`editable: \${editable.join(', ')}\`)
log(\`original: \${languages.join(', ')}\`)`,
    run: arrays,
  },
  {
    title: 'Sets',
    explanation: 'A Set holds each value once and remembers insertion order.',
    code: `const mobile = new Set(['TypeScript', 'Swift', 'C'])
const systems = new Set(['C', 'Rust', 'Zig'])
const both = [...mobile].filter((language) => systems.has(language))
const either = new Set([...mobile, ...systems])
log(\`both: \${both.join(', ')}\`)
log(\`either: \${[...either].join(', ')}\`)
log(\`has Rust: \${systems.has('Rust')}\`)`,
    run: sets,
  },
  {
    title: 'Maps',
    explanation: 'A Map looks values up by key, accepts any key type, and iterates in insertion order.',
    code: `const stock = new Map<string, number>([
  ['apple', 3],
  ['pear', 0],
])
stock.set('kiwi', 5)
stock.set('apple', (stock.get('apple') ?? 0) - 1)
for (const [fruit, count] of stock) {
  log(\`\${fruit}: \${count}\`)
}
log(\`plum: \${stock.get('plum') ?? 0}\`)`,
    run: maps,
  },
  {
    title: 'map, filter, and reduce',
    explanation: 'Array methods transform a list without a loop; each returns a new array or value.',
    code: `const prices = [12, 5, 30, 8]
const discounted = prices.map((price) => Math.floor(price * 0.9))
const cheap = prices.filter((price) => price < 10)
const total = prices.reduce((sum, price) => sum + price, 0)
log(\`discounted: \${discounted.join(', ')}\`)
log(\`cheap: \${cheap.join(', ')}\`)
log(\`total: \${total}\`)`,
    run: higherOrder,
  },
  {
    title: 'Copies are shallow',
    explanation: 'Spreading an array copies the list, not the objects in it. Copy each object too when they must be independent.',
    code: `const original = [{ name: 'Ada' }]
const shallow = [...original]
const deep = original.map((person) => ({ ...person }))
shallow[0].name = 'Lin'
log(\`original: \${original[0].name}\`)
log(\`deep copy: \${deep[0].name}\`)`,
    run: shallowCopies,
  },
]

function arrays(log: SampleLog) {
  const languages = ['Rust', 'TypeScript', 'C']
  log(`sorted: ${languages.toSorted().join(', ')}`)
  const editable = [...languages, 'Swift']
  log(`editable: ${editable.join(', ')}`)
  log(`original: ${languages.join(', ')}`)
}

function sets(log: SampleLog) {
  const mobile = new Set(['TypeScript', 'Swift', 'C'])
  const systems = new Set(['C', 'Rust', 'Zig'])
  const both = [...mobile].filter((language) => systems.has(language))
  const either = new Set([...mobile, ...systems])
  log(`both: ${both.join(', ')}`)
  log(`either: ${[...either].join(', ')}`)
  log(`has Rust: ${systems.has('Rust')}`)
}

function maps(log: SampleLog) {
  const stock = new Map<string, number>([
    ['apple', 3],
    ['pear', 0],
  ])
  stock.set('kiwi', 5)
  stock.set('apple', (stock.get('apple') ?? 0) - 1)
  for (const [fruit, count] of stock) {
    log(`${fruit}: ${count}`)
  }
  log(`plum: ${stock.get('plum') ?? 0}`)
}

function higherOrder(log: SampleLog) {
  const prices = [12, 5, 30, 8]
  const discounted = prices.map((price) => Math.floor(price * 0.9))
  const cheap = prices.filter((price) => price < 10)
  const total = prices.reduce((sum, price) => sum + price, 0)
  log(`discounted: ${discounted.join(', ')}`)
  log(`cheap: ${cheap.join(', ')}`)
  log(`total: ${total}`)
}

function shallowCopies(log: SampleLog) {
  const original = [{ name: 'Ada' }]
  const shallow = [...original]
  const deep = original.map((person) => ({ ...person }))
  shallow[0].name = 'Lin'
  log(`original: ${original[0].name}`)
  log(`deep copy: ${deep[0].name}`)
}
