import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Promises & async/await topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const promisesSamples: CodeSample[] = [
  {
    title: 'async and await',
    explanation: 'await pauses an async function until a promise settles, without blocking the page.',
    code: `const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function fetchGreeting(name: string): Promise<string> {
  await wait(300) // stands in for a network call
  return \`Hello, \${name}\`
}
log('before')
log(await fetchGreeting('Ada'))
log('after')`,
    run: asyncAwait,
  },
  {
    title: 'Promise.all',
    explanation: 'Promise.all starts several promises together and waits for all of them, instead of one after another.',
    code: `const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function price(item: string): Promise<number> {
  await wait(200)
  return item.length * 10
}
const started = performance.now()
const prices = await Promise.all(['apple', 'melon', 'kiwi'].map((item) => price(item)))
log(\`total: \${prices.reduce((sum, p) => sum + p, 0)}\`)
log(\`three 0.2 s waits overlapped: \${performance.now() - started < 550}\`)`,
    run: promiseAll,
  },
  {
    title: 'Promise.allSettled',
    explanation: 'allSettled waits for every promise and reports each result, so one failure does not hide the others.',
    code: `async function check(name: string): Promise<string> {
  if (name.length < 3) throw new Error(\`\${name} is too short\`)
  return \`\${name} ok\`
}
const results = await Promise.allSettled(['Ada', 'Li', 'Grace'].map((name) => check(name)))
for (const result of results) {
  log(result.status === 'fulfilled' ? result.value : \`rejected: \${(result.reason as Error).message}\`)
}`,
    run: promiseAllSettled,
  },
  {
    title: 'Cancellation with AbortController',
    explanation: 'An AbortSignal tells running work to stop; the work listens for it and rejects.',
    code: `function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}
const controller = new AbortController()
setTimeout(() => controller.abort(new Error('cancelled')), 100)
let steps = 0
try {
  while (steps < 100) {
    await wait(20, controller.signal)
    steps += 1
  }
} catch (error) {
  log(\`stopped: \${(error as Error).message}\`)
}
log(\`stopped early: \${steps < 100}\`)`,
    run: cancellation,
  },
  {
    title: 'The event loop',
    explanation: 'Synchronous code runs first, then promise callbacks (microtasks), then timers (tasks), even a 0 ms timer.',
    code: `setTimeout(() => log('3: timer callback (a task)'), 0)
void Promise.resolve().then(() => log('2: promise callback (a microtask)'))
log('1: synchronous code')
await new Promise((resolve) => setTimeout(resolve, 10))`,
    run: eventLoop,
  },
]

async function asyncAwait(log: SampleLog) {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  async function fetchGreeting(name: string): Promise<string> {
    await wait(300) // stands in for a network call
    return `Hello, ${name}`
  }
  log('before')
  log(await fetchGreeting('Ada'))
  log('after')
}

async function promiseAll(log: SampleLog) {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  async function price(item: string): Promise<number> {
    await wait(200)
    return item.length * 10
  }
  const started = performance.now()
  const prices = await Promise.all(['apple', 'melon', 'kiwi'].map((item) => price(item)))
  log(`total: ${prices.reduce((sum, p) => sum + p, 0)}`)
  log(`three 0.2 s waits overlapped: ${performance.now() - started < 550}`)
}

async function promiseAllSettled(log: SampleLog) {
  async function check(name: string): Promise<string> {
    if (name.length < 3) throw new Error(`${name} is too short`)
    return `${name} ok`
  }
  const results = await Promise.allSettled(['Ada', 'Li', 'Grace'].map((name) => check(name)))
  for (const result of results) {
    log(result.status === 'fulfilled' ? result.value : `rejected: ${(result.reason as Error).message}`)
  }
}

async function cancellation(log: SampleLog) {
  function wait(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms)
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    })
  }
  const controller = new AbortController()
  setTimeout(() => controller.abort(new Error('cancelled')), 100)
  let steps = 0
  try {
    while (steps < 100) {
      await wait(20, controller.signal)
      steps += 1
    }
  } catch (error) {
    log(`stopped: ${(error as Error).message}`)
  }
  log(`stopped early: ${steps < 100}`)
}

async function eventLoop(log: SampleLog) {
  setTimeout(() => log('3: timer callback (a task)'), 0)
  void Promise.resolve().then(() => log('2: promise callback (a microtask)'))
  log('1: synchronous code')
  await new Promise((resolve) => setTimeout(resolve, 10))
}
