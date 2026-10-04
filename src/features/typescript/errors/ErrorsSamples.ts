import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Error handling topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const errorsSamples: CodeSample[] = [
  {
    title: 'try, catch, and finally',
    explanation: 'catch handles a thrown error; finally runs either way, even after a return.',
    code: `function parse(text: string): number {
  try {
    const value: unknown = JSON.parse(text)
    if (typeof value !== 'number') throw new TypeError('not a number')
    return value
  } catch {
    return -1
  } finally {
    log(\`parsed \${JSON.stringify(text)}\`)
  }
}
log(\`parse('12') = \${parse('12')}\`)
log(\`parse('twelve') = \${parse('twelve')}\`)`,
    run: tryCatchFinally,
  },
  {
    title: 'Custom error classes',
    explanation: 'Extend Error to carry details, and check the type with instanceof before handling it.',
    code: `class InsufficientFunds extends Error {
  readonly needed: number
  constructor(needed: number) {
    super(\`need \${needed} more\`)
    this.name = 'InsufficientFunds'
    this.needed = needed
  }
}
function withdraw(balance: number, amount: number): number {
  if (amount > balance) throw new InsufficientFunds(amount - balance)
  return balance - amount
}
for (const amount of [30, 80]) {
  try {
    log(\`left: \${withdraw(50, amount)}\`)
  } catch (error) {
    if (error instanceof InsufficientFunds) log(\`failed: \${error.message}\`)
    else throw error
  }
}`,
    run: customErrors,
  },
  {
    title: 'unknown in catch',
    explanation: 'JavaScript can throw any value, so a caught error is unknown until you check it.',
    code: `function describe(error: unknown): string {
  if (error instanceof Error) return \`\${error.name}\`
  return \`non-error value: \${String(error)}\`
}
try {
  JSON.parse('{')
} catch (error) {
  log(describe(error))
}
try {
  throw 'just a string' // allowed, but loses the stack trace
} catch (error) {
  log(describe(error))
}`,
    run: unknownInCatch,
  },
  {
    title: 'Result values',
    explanation: 'Returning a success-or-failure value makes the failure part of the type, so callers cannot forget it.',
    code: `type Result<T> = { ok: true; value: T } | { ok: false; error: string }
function divide(a: number, b: number): Result<number> {
  return b === 0 ? { ok: false, error: 'division by zero' } : { ok: true, value: a / b }
}
for (const [a, b] of [
  [10, 2],
  [1, 0],
]) {
  const result = divide(a, b)
  log(result.ok ? \`\${a} / \${b} = \${result.value}\` : \`\${a} / \${b} failed: \${result.error}\`)
}`,
    run: resultValues,
  },
  {
    title: 'finally for cleanup',
    explanation: 'Put cleanup in finally so it runs whether the work succeeds, fails, or returns early.',
    code: `function process(name: string): string {
  log(\`open "\${name}"\`)
  try {
    if (name === '') throw new Error('empty')
    log(\`processed \${name.toLowerCase()}\`)
    return 'ok'
  } catch (error) {
    log(\`failed: \${(error as Error).message}\`)
    return 'error'
  } finally {
    log(\`close "\${name}"\`)
  }
}
log(\`result: \${process('Ada')}\`)
log(\`result: \${process('')}\`)`,
    run: finallyCleanup,
  },
]

function tryCatchFinally(log: SampleLog) {
  function parse(text: string): number {
    try {
      const value: unknown = JSON.parse(text)
      if (typeof value !== 'number') throw new TypeError('not a number')
      return value
    } catch {
      return -1
    } finally {
      log(`parsed ${JSON.stringify(text)}`)
    }
  }
  log(`parse('12') = ${parse('12')}`)
  log(`parse('twelve') = ${parse('twelve')}`)
}

function customErrors(log: SampleLog) {
  class InsufficientFunds extends Error {
    readonly needed: number
    constructor(needed: number) {
      super(`need ${needed} more`)
      this.name = 'InsufficientFunds'
      this.needed = needed
    }
  }
  function withdraw(balance: number, amount: number): number {
    if (amount > balance) throw new InsufficientFunds(amount - balance)
    return balance - amount
  }
  for (const amount of [30, 80]) {
    try {
      log(`left: ${withdraw(50, amount)}`)
    } catch (error) {
      if (error instanceof InsufficientFunds) log(`failed: ${error.message}`)
      else throw error
    }
  }
}

function unknownInCatch(log: SampleLog) {
  function describe(error: unknown): string {
    if (error instanceof Error) return `${error.name}`
    return `non-error value: ${String(error)}`
  }
  try {
    JSON.parse('{')
  } catch (error) {
    log(describe(error))
  }
  try {
    throw 'just a string' // allowed, but loses the stack trace
  } catch (error) {
    log(describe(error))
  }
}

function resultValues(log: SampleLog) {
  type Result<T> = { ok: true; value: T } | { ok: false; error: string }
  function divide(a: number, b: number): Result<number> {
    return b === 0 ? { ok: false, error: 'division by zero' } : { ok: true, value: a / b }
  }
  for (const [a, b] of [
    [10, 2],
    [1, 0],
  ]) {
    const result = divide(a, b)
    log(result.ok ? `${a} / ${b} = ${result.value}` : `${a} / ${b} failed: ${result.error}`)
  }
}

function finallyCleanup(log: SampleLog) {
  function process(name: string): string {
    log(`open "${name}"`)
    try {
      if (name === '') throw new Error('empty')
      log(`processed ${name.toLowerCase()}`)
      return 'ok'
    } catch (error) {
      log(`failed: ${(error as Error).message}`)
      return 'error'
    } finally {
      log(`close "${name}"`)
    }
  }
  log(`result: ${process('Ada')}`)
  log(`result: ${process('')}`)
}
