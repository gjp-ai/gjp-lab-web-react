import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Functions & closures topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const functionsSamples: CodeSample[] = [
  {
    title: 'Default and optional parameters',
    explanation: 'A default value makes a parameter optional; ? makes it optional with undefined when missing.',
    code: `function greet(name: string, greeting = 'Hello', punctuation?: string): string {
  return \`\${greeting}, \${name}\${punctuation ?? '!'}\`
}
log(greet('Ada'))
log(greet('Ada', 'Welcome'))
log(greet('Lin', undefined, '?'))`,
    run: defaultParameters,
  },
  {
    title: 'Rest parameters and spread',
    explanation: '...numbers collects any number of arguments into an array; ...scores spreads an array back into arguments.',
    code: `function average(...numbers: number[]): number {
  return numbers.length === 0 ? 0 : numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}
log(\`average(2, 4, 9) = \${average(2, 4, 9)}\`)
log(\`average() = \${average()}\`)
const scores = [70, 90]
log(\`average(...scores) = \${average(...scores)}\`)`,
    run: restParameters,
  },
  {
    title: 'Arrow functions',
    explanation: 'An arrow function is a short function value, ideal as an argument to another function.',
    code: `const square = (n: number) => n * n
log(\`square(7) = \${square(7)}\`)
const words = ['arrow', 'fn', 'it']
log(words.toSorted((a, b) => a.length - b.length).join(', '))
log(words.map((word) => word.toUpperCase()).join(' | '))`,
    run: arrowFunctions,
  },
  {
    title: 'Closures capture variables',
    explanation: 'A function keeps the variables it uses alive. Each counter captures its own count.',
    code: `function makeCounter(): () => number {
  let count = 0
  return () => {
    count += 1
    return count
  }
}
const first = makeCounter()
const second = makeCounter()
log(\`first: \${first()}, \${first()}, \${first()}\`)
log(\`second: \${second()}, \${second()}\`)`,
    run: closures,
  },
  {
    title: 'Functions as values',
    explanation: 'Functions can be stored, passed, and returned like any value; a higher-order function takes or returns one.',
    code: `const isEven = (n: number) => n % 2 === 0
function applyTwice(value: number, transform: (n: number) => number): number {
  return transform(transform(value))
}
log(\`evens: \${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(isEven).join(', ')}\`)
log(\`applyTwice(3, n => n * 10) = \${applyTwice(3, (n) => n * 10)}\`)`,
    run: functionsAsValues,
  },
]

function defaultParameters(log: SampleLog) {
  function greet(name: string, greeting = 'Hello', punctuation?: string): string {
    return `${greeting}, ${name}${punctuation ?? '!'}`
  }
  log(greet('Ada'))
  log(greet('Ada', 'Welcome'))
  log(greet('Lin', undefined, '?'))
}

function restParameters(log: SampleLog) {
  function average(...numbers: number[]): number {
    return numbers.length === 0 ? 0 : numbers.reduce((sum, n) => sum + n, 0) / numbers.length
  }
  log(`average(2, 4, 9) = ${average(2, 4, 9)}`)
  log(`average() = ${average()}`)
  const scores = [70, 90]
  log(`average(...scores) = ${average(...scores)}`)
}

function arrowFunctions(log: SampleLog) {
  const square = (n: number) => n * n
  log(`square(7) = ${square(7)}`)
  const words = ['arrow', 'fn', 'it']
  log(words.toSorted((a, b) => a.length - b.length).join(', '))
  log(words.map((word) => word.toUpperCase()).join(' | '))
}

function closures(log: SampleLog) {
  function makeCounter(): () => number {
    let count = 0
    return () => {
      count += 1
      return count
    }
  }
  const first = makeCounter()
  const second = makeCounter()
  log(`first: ${first()}, ${first()}, ${first()}`)
  log(`second: ${second()}, ${second()}`)
}

function functionsAsValues(log: SampleLog) {
  const isEven = (n: number) => n % 2 === 0
  function applyTwice(value: number, transform: (n: number) => number): number {
    return transform(transform(value))
  }
  log(`evens: ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(isEven).join(', ')}`)
  log(`applyTwice(3, n => n * 10) = ${applyTwice(3, (n) => n * 10)}`)
}
