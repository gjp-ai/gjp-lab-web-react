import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Objects, classes & enums topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const classesSamples: CodeSample[] = [
  {
    title: 'Object types',
    explanation: "A type describes an object's shape. Spread copies an object and overrides some fields; destructuring unpacks them.",
    code: `type Point = { x: number; y: number }
const a: Point = { x: 1, y: 2 }
const moved: Point = { ...a, x: 9 }
log(\`a: (\${a.x}, \${a.y})\`)
log(\`moved: (\${moved.x}, \${moved.y})\`)
const { x, y } = moved
log(\`x = \${x}, y = \${y}\`)`,
    run: objectTypes,
  },
  {
    title: 'Classes',
    explanation: 'A class bundles state and behaviour. A #private field is hidden at run time, and a getter exposes it read-only.',
    code: `class Account {
  readonly owner: string
  #balance: number
  constructor(owner: string, balance: number) {
    this.owner = owner
    this.#balance = balance
  }
  get balance(): number {
    return this.#balance
  }
  deposit(amount: number): void {
    if (amount <= 0) throw new RangeError('amount must be positive')
    this.#balance += amount
  }
}
const account = new Account('Ada', 100)
account.deposit(50)
log(\`\${account.owner}: \${account.balance}\`)`,
    run: classes,
  },
  {
    title: 'Values and references',
    explanation: 'Objects are shared by reference. Spread makes an independent copy; assigning only adds another name for the same object.',
    code: `const original = { volume: 0 }
const copy = { ...original, volume: 99 }
log(\`spread copy: original \${original.volume}, copy \${copy.volume}\`)
const alias = original
alias.volume = 99
log(\`alias: original \${original.volume}, alias \${alias.volume}\`)
log(\`same object: \${alias === original}\`)`,
    run: valuesAndReferences,
  },
  {
    title: 'Enums with as const',
    explanation: 'An as const object plus a type of its values works like an enum and compiles to plain JavaScript. This project allows only syntax that compiles away, so it uses this instead of enum.',
    code: `const Planet = { Mercury: 'mercury', Earth: 'earth', Mars: 'mars' } as const
type Planet = (typeof Planet)[keyof typeof Planet]
const moons: Record<Planet, number> = { mercury: 0, earth: 1, mars: 2 }
for (const planet of Object.values(Planet)) {
  log(\`\${planet}: \${moons[planet]} moons\`)
}
// enum Planet { … }  is rejected here by the erasableSyntaxOnly setting`,
    run: enumsAsConst,
  },
  {
    title: 'Discriminated unions',
    explanation: 'A union of object types with a shared kind field lets a switch handle every case, and the compiler checks none is missed.',
    code: `type Payment = { kind: 'card'; last4: string } | { kind: 'cash'; amount: number } | { kind: 'voucher' }
function describe(payment: Payment): string {
  switch (payment.kind) {
    case 'card':
      return \`card ending \${payment.last4}\`
    case 'cash':
      return \`cash \${payment.amount}\`
    case 'voucher':
      return 'voucher'
  }
}
const payments: Payment[] = [{ kind: 'card', last4: '1234' }, { kind: 'cash', amount: 20 }, { kind: 'voucher' }]
payments.forEach((payment) => log(describe(payment)))`,
    run: discriminatedUnions,
  },
]

function objectTypes(log: SampleLog) {
  type Point = { x: number; y: number }
  const a: Point = { x: 1, y: 2 }
  const moved: Point = { ...a, x: 9 }
  log(`a: (${a.x}, ${a.y})`)
  log(`moved: (${moved.x}, ${moved.y})`)
  const { x, y } = moved
  log(`x = ${x}, y = ${y}`)
}

function classes(log: SampleLog) {
  class Account {
    readonly owner: string
    #balance: number
    constructor(owner: string, balance: number) {
      this.owner = owner
      this.#balance = balance
    }
    get balance(): number {
      return this.#balance
    }
    deposit(amount: number): void {
      if (amount <= 0) throw new RangeError('amount must be positive')
      this.#balance += amount
    }
  }
  const account = new Account('Ada', 100)
  account.deposit(50)
  log(`${account.owner}: ${account.balance}`)
}

function valuesAndReferences(log: SampleLog) {
  const original = { volume: 0 }
  const copy = { ...original, volume: 99 }
  log(`spread copy: original ${original.volume}, copy ${copy.volume}`)
  const alias = original
  alias.volume = 99
  log(`alias: original ${original.volume}, alias ${alias.volume}`)
  log(`same object: ${alias === original}`)
}

function enumsAsConst(log: SampleLog) {
  const Planet = { Mercury: 'mercury', Earth: 'earth', Mars: 'mars' } as const
  type Planet = (typeof Planet)[keyof typeof Planet]
  const moons: Record<Planet, number> = { mercury: 0, earth: 1, mars: 2 }
  for (const planet of Object.values(Planet)) {
    log(`${planet}: ${moons[planet]} moons`)
  }
  // enum Planet { … }  is rejected here by the erasableSyntaxOnly setting
}

function discriminatedUnions(log: SampleLog) {
  type Payment = { kind: 'card'; last4: string } | { kind: 'cash'; amount: number } | { kind: 'voucher' }
  function describe(payment: Payment): string {
    switch (payment.kind) {
      case 'card':
        return `card ending ${payment.last4}`
      case 'cash':
        return `cash ${payment.amount}`
      case 'voucher':
        return 'voucher'
    }
  }
  const payments: Payment[] = [{ kind: 'card', last4: '1234' }, { kind: 'cash', amount: 20 }, { kind: 'voucher' }]
  payments.forEach((payment) => log(describe(payment)))
}
