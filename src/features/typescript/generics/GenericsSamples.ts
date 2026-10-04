import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Interfaces & generics topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const genericsSamples: CodeSample[] = [
  {
    title: 'Interfaces',
    explanation: 'An interface names an object shape; any value with that shape can be used where the interface is expected.',
    code: `interface Shape {
  name: string
  area(): number
}
const square: Shape = { name: 'Square', area: () => 2 * 2 }
const disc: Shape = { name: 'Disc', area: () => Math.PI * 1 * 1 }
for (const shape of [square, disc]) {
  log(\`\${shape.name} with area \${shape.area().toFixed(1)}\`)
}`,
    run: interfaces,
  },
  {
    title: 'Structural typing',
    explanation: 'TypeScript compares shapes, not names: an object fits an interface if it has the required properties.',
    code: `interface Named {
  name: string
}
function hello(thing: Named): string {
  return \`Hello, \${thing.name}\`
}
const robot = { name: 'R2', beeps: true }
log(hello(robot)) // robot never says it is Named; its shape is enough
log(hello({ name: 'Ada' }))`,
    run: structuralTyping,
  },
  {
    title: 'Generic functions',
    explanation: 'A type parameter lets one function work with many types while keeping them checked.',
    code: `function largest<T>(items: T[], compare: (a: T, b: T) => number): T | undefined {
  return items.length === 0 ? undefined : items.reduce((best, item) => (compare(item, best) > 0 ? item : best))
}
log(\`largest number: \${largest([3, 9, 4], (a, b) => a - b)}\`)
log(\`largest word: \${largest(['pear', 'apple'], (a, b) => a.localeCompare(b))}\`)
log(\`largest of none: \${largest<number>([], (a, b) => a - b)}\`)`,
    run: genericFunctions,
  },
  {
    title: 'Generic classes',
    explanation: 'A generic class is written once and checked for each element type; a Stack<string> only accepts strings.',
    code: `class Stack<T> {
  #items: T[] = []
  push(item: T): void {
    this.#items.push(item)
  }
  pop(): T | undefined {
    return this.#items.pop()
  }
  get size(): number {
    return this.#items.length
  }
}
const stack = new Stack<string>()
stack.push('first')
stack.push('second')
log(\`pop: \${stack.pop()}, size: \${stack.size}\`)
// stack.push(3)  would not compile: number is not a string`,
    run: genericClasses,
  },
  {
    title: 'Utility types',
    explanation: 'Built-in generic types derive new types from old ones: Partial makes fields optional, Pick keeps some, Readonly forbids changes.',
    code: `interface User {
  id: number
  name: string
  email: string
}
const draft: Partial<User> = { name: 'Ada' }
const preview: Pick<User, 'id' | 'name'> = { id: 1, name: 'Ada' }
const frozen: Readonly<User> = { id: 1, name: 'Ada', email: 'ada@example.com' }
log(\`draft keys: \${Object.keys(draft).join(', ')}\`)
log(\`preview keys: \${Object.keys(preview).join(', ')}\`)
log(\`frozen.name: \${frozen.name}\`)
// frozen.name = 'Lin'  would not compile: name is read-only`,
    run: utilityTypes,
  },
]

function interfaces(log: SampleLog) {
  interface Shape {
    name: string
    area(): number
  }
  const square: Shape = { name: 'Square', area: () => 2 * 2 }
  const disc: Shape = { name: 'Disc', area: () => Math.PI * 1 * 1 }
  for (const shape of [square, disc]) {
    log(`${shape.name} with area ${shape.area().toFixed(1)}`)
  }
}

function structuralTyping(log: SampleLog) {
  interface Named {
    name: string
  }
  function hello(thing: Named): string {
    return `Hello, ${thing.name}`
  }
  const robot = { name: 'R2', beeps: true }
  log(hello(robot)) // robot never says it is Named; its shape is enough
  log(hello({ name: 'Ada' }))
}

function genericFunctions(log: SampleLog) {
  function largest<T>(items: T[], compare: (a: T, b: T) => number): T | undefined {
    return items.length === 0 ? undefined : items.reduce((best, item) => (compare(item, best) > 0 ? item : best))
  }
  log(`largest number: ${largest([3, 9, 4], (a, b) => a - b)}`)
  log(`largest word: ${largest(['pear', 'apple'], (a, b) => a.localeCompare(b))}`)
  log(`largest of none: ${largest<number>([], (a, b) => a - b)}`)
}

function genericClasses(log: SampleLog) {
  class Stack<T> {
    #items: T[] = []
    push(item: T): void {
      this.#items.push(item)
    }
    pop(): T | undefined {
      return this.#items.pop()
    }
    get size(): number {
      return this.#items.length
    }
  }
  const stack = new Stack<string>()
  stack.push('first')
  stack.push('second')
  log(`pop: ${stack.pop()}, size: ${stack.size}`)
  // stack.push(3)  would not compile: number is not a string
}

function utilityTypes(log: SampleLog) {
  interface User {
    id: number
    name: string
    email: string
  }
  const draft: Partial<User> = { name: 'Ada' }
  const preview: Pick<User, 'id' | 'name'> = { id: 1, name: 'Ada' }
  const frozen: Readonly<User> = { id: 1, name: 'Ada', email: 'ada@example.com' }
  log(`draft keys: ${Object.keys(draft).join(', ')}`)
  log(`preview keys: ${Object.keys(preview).join(', ')}`)
  log(`frozen.name: ${frozen.name}`)
  // frozen.name = 'Lin'  would not compile: name is read-only
}
