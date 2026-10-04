import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Iterators & generators topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const iteratorsSamples: CodeSample[] = [
  {
    title: 'for…of and iterables',
    explanation: 'for…of works on anything iterable: strings, arrays, maps, and sets.',
    code: `for (const letter of 'TS') {
  log(\`letter: \${letter}\`)
}
for (const [index, fruit] of ['apple', 'kiwi'].entries()) {
  log(\`\${index}: \${fruit}\`)
}
for (const [key, value] of new Map([['a', 1]])) {
  log(\`\${key} = \${value}\`)
}`,
    run: forOf,
  },
  {
    title: 'Generators',
    explanation: 'function* pauses at each yield and resumes when the next value is asked for.',
    code: `function* countdown(from: number) {
  for (let n = from; n > 0; n -= 1) {
    yield n
  }
}
log([...countdown(3)].join(', '))
const steps = countdown(2)
log(JSON.stringify(steps.next()))
log(JSON.stringify(steps.next()))
log(JSON.stringify(steps.next()))`,
    run: generators,
  },
  {
    title: 'Lazy, infinite sequences',
    explanation: 'A generator computes values only when asked, so it can describe an endless sequence safely.',
    code: `function* naturals() {
  let n = 1
  while (true) {
    yield n
    n += 1
  }
}
function* take<T>(count: number, items: Iterable<T>) {
  let taken = 0
  for (const item of items) {
    if (taken === count) return
    yield item
    taken += 1
  }
}
const squares = [...take(5, naturals())].map((n) => n * n)
log(\`first five squares: \${squares.join(', ')}\`)`,
    run: lazySequences,
  },
  {
    title: 'Custom iterables',
    explanation: 'A class becomes iterable by defining [Symbol.iterator]; then for…of and spread work on it.',
    code: `class Range implements Iterable<number> {
  readonly start: number
  readonly end: number
  constructor(start: number, end: number) {
    this.start = start
    this.end = end
  }
  *[Symbol.iterator]() {
    for (let n = this.start; n <= this.end; n += 1) {
      yield n
    }
  }
}
const range = new Range(1, 5)
log(\`spread: \${[...range].join(', ')}\`)
log(\`sum: \${[...range].reduce((sum, n) => sum + n, 0)}\`)`,
    run: customIterables,
  },
  {
    title: 'Destructuring and Array.from',
    explanation: 'Destructuring and Array.from also read from iterables, taking only what they need.',
    code: `const [first, second, ...rest] = 'abcde'
log(\`first: \${first}, second: \${second}, rest: \${rest.join('')}\`)
log(\`Array.from: \${Array.from({ length: 4 }, (_, i) => i * i).join(', ')}\`)`,
    run: destructuringIterables,
  },
]

function forOf(log: SampleLog) {
  for (const letter of 'TS') {
    log(`letter: ${letter}`)
  }
  for (const [index, fruit] of ['apple', 'kiwi'].entries()) {
    log(`${index}: ${fruit}`)
  }
  for (const [key, value] of new Map([['a', 1]])) {
    log(`${key} = ${value}`)
  }
}

function generators(log: SampleLog) {
  function* countdown(from: number) {
    for (let n = from; n > 0; n -= 1) {
      yield n
    }
  }
  log([...countdown(3)].join(', '))
  const steps = countdown(2)
  log(JSON.stringify(steps.next()))
  log(JSON.stringify(steps.next()))
  log(JSON.stringify(steps.next()))
}

function lazySequences(log: SampleLog) {
  function* naturals() {
    let n = 1
    while (true) {
      yield n
      n += 1
    }
  }
  function* take<T>(count: number, items: Iterable<T>) {
    let taken = 0
    for (const item of items) {
      if (taken === count) return
      yield item
      taken += 1
    }
  }
  const squares = [...take(5, naturals())].map((n) => n * n)
  log(`first five squares: ${squares.join(', ')}`)
}

function customIterables(log: SampleLog) {
  class Range implements Iterable<number> {
    readonly start: number
    readonly end: number
    constructor(start: number, end: number) {
      this.start = start
      this.end = end
    }
    *[Symbol.iterator]() {
      for (let n = this.start; n <= this.end; n += 1) {
        yield n
      }
    }
  }
  const range = new Range(1, 5)
  log(`spread: ${[...range].join(', ')}`)
  log(`sum: ${[...range].reduce((sum, n) => sum + n, 0)}`)
}

function destructuringIterables(log: SampleLog) {
  const [first, second, ...rest] = 'abcde'
  log(`first: ${first}, second: ${second}, rest: ${rest.join('')}`)
  log(`Array.from: ${Array.from({ length: 4 }, (_, i) => i * i).join(', ')}`)
}
