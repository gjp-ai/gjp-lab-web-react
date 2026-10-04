import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Null & undefined topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const nullishSamples: CodeSample[] = [
  {
    title: 'null and undefined',
    explanation: 'undefined means a value was never set; null means it is deliberately empty. A type must say it allows either.',
    code: `let nickname: string | undefined
log(\`nickname: \${nickname}\`)
nickname = 'Ada'
log(\`nickname: \${nickname}\`)
const empty: string | null = null
log(\`empty: \${empty}\`)
// empty.length  would not compile: 'empty' is possibly null`,
    run: nullAndUndefined,
  },
  {
    title: 'Narrowing',
    explanation: 'After a check, TypeScript narrows the type inside the branch, so no assertion is needed.',
    code: `function greet(nickname: string | undefined): string {
  if (nickname !== undefined) {
    // Narrowed: nickname is a string here.
    return \`Hello, \${nickname} (\${nickname.length} letters)!\`
  }
  return 'Hello, guest!'
}
log(greet('Ada'))
log(greet(undefined))`,
    run: narrowing,
  },
  {
    title: '?? versus ||',
    explanation: '?? falls back only for null and undefined; || also replaces 0 and the empty string, which is often a bug.',
    code: `const settings: { volume?: number; name?: string } = { volume: 0, name: '' }
log(\`volume ?? 5 = \${settings.volume ?? 5}\`)
log(\`volume || 5 = \${settings.volume || 5}\`)
log(\`name ?? 'Guest' = "\${settings.name ?? 'Guest'}"\`)
log(\`name || 'Guest' = "\${settings.name || 'Guest'}"\`)`,
    run: nullishCoalescing,
  },
  {
    title: 'Optional chaining',
    explanation: '?. stops at the first null or undefined and gives undefined instead of throwing.',
    code: `interface Address {
  city?: string
}
interface User {
  address?: Address
}
const resident: User = { address: { city: 'Singapore' } }
const visitor: User = {}
log(\`city: \${resident.address?.city ?? 'unknown'}\`)
log(\`city: \${visitor.address?.city ?? 'unknown'}\`)
log(\`letters: \${resident.address?.city?.length}\`)
log(\`letters: \${visitor.address?.city?.length}\`)`,
    run: optionalChaining,
  },
  {
    title: 'Non-null assertion !',
    explanation: '! tells the compiler a value is not null or undefined. It checks nothing at run time, so prefer ?? or a narrowing check.',
    code: `const stock = new Map([['apple', 3]])
log(\`stock.get('pear') ?? 0 = \${stock.get('pear') ?? 0}\`)
// stock.get('pear')! compiles, but the value is still undefined at run time.
const apples = stock.get('apple')!
log(\`stock.get('apple')! = \${apples}, safe only because the key exists\`)`,
    run: nonNullAssertion,
  },
]

function nullAndUndefined(log: SampleLog) {
  let nickname: string | undefined
  log(`nickname: ${nickname}`)
  nickname = 'Ada'
  log(`nickname: ${nickname}`)
  const empty: string | null = null
  log(`empty: ${empty}`)
  // empty.length  would not compile: 'empty' is possibly null
}

function narrowing(log: SampleLog) {
  function greet(nickname: string | undefined): string {
    if (nickname !== undefined) {
      // Narrowed: nickname is a string here.
      return `Hello, ${nickname} (${nickname.length} letters)!`
    }
    return 'Hello, guest!'
  }
  log(greet('Ada'))
  log(greet(undefined))
}

function nullishCoalescing(log: SampleLog) {
  const settings: { volume?: number; name?: string } = { volume: 0, name: '' }
  log(`volume ?? 5 = ${settings.volume ?? 5}`)
  log(`volume || 5 = ${settings.volume || 5}`)
  log(`name ?? 'Guest' = "${settings.name ?? 'Guest'}"`)
  log(`name || 'Guest' = "${settings.name || 'Guest'}"`)
}

function optionalChaining(log: SampleLog) {
  interface Address {
    city?: string
  }
  interface User {
    address?: Address
  }
  const resident: User = { address: { city: 'Singapore' } }
  const visitor: User = {}
  log(`city: ${resident.address?.city ?? 'unknown'}`)
  log(`city: ${visitor.address?.city ?? 'unknown'}`)
  log(`letters: ${resident.address?.city?.length}`)
  log(`letters: ${visitor.address?.city?.length}`)
}

function nonNullAssertion(log: SampleLog) {
  const stock = new Map([['apple', 3]])
  log(`stock.get('pear') ?? 0 = ${stock.get('pear') ?? 0}`)
  // stock.get('pear')! compiles, but the value is still undefined at run time.
  const apples = stock.get('apple')!
  log(`stock.get('apple')! = ${apples}, safe only because the key exists`)
}
