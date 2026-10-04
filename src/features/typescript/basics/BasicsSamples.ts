import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Values & types topic. Each function below is the code shown in its `CodeSample`; a
 * test checks that every snippet ends with its function's body.
 */
export const basicsSamples: CodeSample[] = [
  {
    title: 'let and const',
    explanation: 'const cannot be reassigned; let can. Prefer const, and use let only when a value must change.',
    code: `const language = 'TypeScript' // cannot be reassigned
let version = 5.0 // can change
log(\`\${language} \${version.toFixed(1)}\`)
version = 6.0
log(\`\${language} \${version.toFixed(1)}\`)
// language = 'JavaScript'  would not compile: cannot assign to a const`,
    run: letAndConst,
  },
  {
    title: 'Type inference',
    explanation: 'TypeScript infers a type from the value, and typeof shows the type JavaScript sees at run time.',
    code: `const whole = 42
const fraction = 3.5
const words = ['type', 'script']
log(\`\${whole}: \${typeof whole}\`)
log(\`\${fraction}: \${typeof fraction}\`)
log(\`\${words.join(' ')}: array of \${typeof words[0]}\`)`,
    run: typeInference,
  },
  {
    title: 'Numbers and BigInt',
    explanation: 'Every number is a 64-bit float, exact only up to 2^53 − 1. BigInt holds whole numbers of any size.',
    code: `const max = Number.MAX_SAFE_INTEGER
log(\`MAX_SAFE_INTEGER = \${max}\`)
log(\`max + 1 === max + 2: \${max + 1 === max + 2}\`)
log(\`0.1 + 0.2 = \${0.1 + 0.2}\`)
const big = BigInt(max) + 2n
log(\`BigInt: \${big}\`)`,
    run: numbers,
  },
  {
    title: 'Template literals',
    explanation: 'Backtick strings insert any expression with ${…} and can span several lines.',
    code: `const name = 'Ada'
const score = 65
log(\`score: \${score} of 100\`)
log(\`\${name} \${score >= 50 ? 'passed' : 'failed'}\`)
log(\`in capitals: \${name.toUpperCase()}\`)`,
    run: templateLiterals,
  },
  {
    title: 'Destructuring and union types',
    explanation: 'Destructuring unpacks values; a union type lists the only values allowed, and the compiler checks them.',
    code: `type Feeling = 'hot' | 'warm' | 'cool'
const [city, temperature] = ['Singapore', 31] as const
const feeling: Feeling = temperature >= 30 ? 'hot' : temperature >= 20 ? 'warm' : 'cool'
log(\`\${city} is \${feeling} at \${temperature}°C\`)
// const wrong: Feeling = 'cold'  would not compile: not one of the three`,
    run: destructuringAndUnions,
  },
]

function letAndConst(log: SampleLog) {
  const language = 'TypeScript' // cannot be reassigned
  let version = 5.0 // can change
  log(`${language} ${version.toFixed(1)}`)
  version = 6.0
  log(`${language} ${version.toFixed(1)}`)
  // language = 'JavaScript'  would not compile: cannot assign to a const
}

function typeInference(log: SampleLog) {
  const whole = 42
  const fraction = 3.5
  const words = ['type', 'script']
  log(`${whole}: ${typeof whole}`)
  log(`${fraction}: ${typeof fraction}`)
  log(`${words.join(' ')}: array of ${typeof words[0]}`)
}

function numbers(log: SampleLog) {
  const max = Number.MAX_SAFE_INTEGER
  log(`MAX_SAFE_INTEGER = ${max}`)
  log(`max + 1 === max + 2: ${max + 1 === max + 2}`)
  log(`0.1 + 0.2 = ${0.1 + 0.2}`)
  const big = BigInt(max) + 2n
  log(`BigInt: ${big}`)
}

function templateLiterals(log: SampleLog) {
  const name = 'Ada'
  const score = 65
  log(`score: ${score} of 100`)
  log(`${name} ${score >= 50 ? 'passed' : 'failed'}`)
  log(`in capitals: ${name.toUpperCase()}`)
}

function destructuringAndUnions(log: SampleLog) {
  type Feeling = 'hot' | 'warm' | 'cool'
  const [city, temperature] = ['Singapore', 31] as const
  const feeling: Feeling = temperature >= 30 ? 'hot' : temperature >= 20 ? 'warm' : 'cool'
  log(`${city} is ${feeling} at ${temperature}°C`)
  // const wrong: Feeling = 'cold'  would not compile: not one of the three
}
