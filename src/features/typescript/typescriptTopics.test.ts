import { describe, expect, it } from 'vitest'
import { runSample, type CodeSample } from '@/common/codesample/CodeSample'
import { basicsSamples } from './basics/BasicsSamples'
import basicsSource from './basics/BasicsSamples.ts?raw'
import { classesSamples } from './classes/ClassesSamples'
import classesSource from './classes/ClassesSamples.ts?raw'
import { collectionsSamples } from './collections/CollectionsSamples'
import collectionsSource from './collections/CollectionsSamples.ts?raw'
import { errorsSamples } from './errors/ErrorsSamples'
import errorsSource from './errors/ErrorsSamples.ts?raw'
import { functionsSamples } from './functions/FunctionsSamples'
import functionsSource from './functions/FunctionsSamples.ts?raw'
import { genericsSamples } from './generics/GenericsSamples'
import genericsSource from './generics/GenericsSamples.ts?raw'
import { iteratorsSamples } from './iterators/IteratorsSamples'
import iteratorsSource from './iterators/IteratorsSamples.ts?raw'
import { nullishSamples } from './nullish/NullishSamples'
import nullishSource from './nullish/NullishSamples.ts?raw'
import { promisesSamples } from './promises/PromisesSamples'
import promisesSource from './promises/PromisesSamples.ts?raw'
import { stringsSamples } from './strings/StringsSamples'
import stringsSource from './strings/StringsSamples.ts?raw'

/**
 * Runs the TypeScript category's samples and checks what they log. The generic tests run every sample and
 * check that its snippet matches the code that runs; the topic tests check the lines that show each
 * language feature.
 */
const topics: { name: string; samples: CodeSample[]; source: string }[] = [
  { name: 'Values & types', samples: basicsSamples, source: basicsSource },
  { name: 'Null & undefined', samples: nullishSamples, source: nullishSource },
  { name: 'Arrays, sets & maps', samples: collectionsSamples, source: collectionsSource },
  { name: 'Functions & closures', samples: functionsSamples, source: functionsSource },
  { name: 'Objects, classes & enums', samples: classesSamples, source: classesSource },
  { name: 'Interfaces & generics', samples: genericsSamples, source: genericsSource },
  { name: 'Error handling', samples: errorsSamples, source: errorsSource },
  { name: 'Promises & async/await', samples: promisesSamples, source: promisesSource },
  { name: 'Iterators & generators', samples: iteratorsSamples, source: iteratorsSource },
  { name: 'Strings & regex', samples: stringsSamples, source: stringsSource },
]

/** The dedented bodies of the top-level `function name(log: SampleLog)` declarations, in file order. */
function sampleFunctionBodies(text: string): string[] {
  const lines = text.split('\n')
  return lines.flatMap((line, start) => {
    if (!/^(async )?function \w+\(log: SampleLog\) \{$/.test(line)) return []
    const end = lines.findIndex((candidate, index) => index > start && candidate === '}')
    return [lines.slice(start + 1, end).map((body) => body.replace(/^ {2}/, '')).join('\n').trimEnd()]
  })
}

function output(samples: CodeSample[], title: string): Promise<string[]> {
  const sample = samples.find((candidate) => candidate.title === title)
  if (sample === undefined) throw new Error(`No sample titled ${title}`)
  return runSample(sample)
}

describe('every TypeScript sample', () => {
  it('has a unique title, code, and output', async () => {
    for (const topic of topics) {
      expect(topic.samples.length, `${topic.name} has no samples`).toBeGreaterThan(0)
      expect(new Set(topic.samples.map((sample) => sample.title)).size, `${topic.name} repeats a title`).toBe(topic.samples.length)
      for (const sample of topic.samples) {
        expect(sample.code.trim(), `${topic.name} – ${sample.title}`).not.toBe('')
        expect(await runSample(sample), `${topic.name} – ${sample.title} logged nothing`).not.toHaveLength(0)
      }
    }
  })

  it('logs the same output every run', async () => {
    for (const topic of topics) {
      for (const sample of topic.samples) {
        expect(await runSample(sample), `${topic.name} – ${sample.title} changed between runs`).toEqual(await runSample(sample))
      }
    }
  })

  it('shows the code that runs', () => {
    for (const topic of topics) {
      const bodies = sampleFunctionBodies(topic.source)
      expect(bodies, `${topic.name}: one function per sample`).toHaveLength(topic.samples.length)
      topic.samples.forEach((sample, index) => {
        expect(sample.code.trimEnd().endsWith(bodies[index]), `${topic.name} – ${sample.title}: snippet differs from its function`).toBe(true)
      })
    }
  })
})

describe('TypeScript topics', () => {
  it('Values & types: inferred types and number limits', async () => {
    expect(await output(basicsSamples, 'let and const')).toEqual(['TypeScript 5.0', 'TypeScript 6.0'])
    expect(await output(basicsSamples, 'Type inference')).toEqual(['42: number', '3.5: number', 'type script: array of string'])
    const numbers = await output(basicsSamples, 'Numbers and BigInt')
    expect(numbers).toContain('max + 1 === max + 2: true')
    expect(numbers).toContain('0.1 + 0.2 = 0.30000000000000004')
    expect(numbers).toContain('BigInt: 9007199254740993')
    expect(await output(basicsSamples, 'Destructuring and union types')).toEqual(['Singapore is hot at 31°C'])
  })

  it('Null & undefined: ?? keeps 0 and the empty string, || does not', async () => {
    expect(await output(nullishSamples, '?? versus ||')).toEqual([
      'volume ?? 5 = 0',
      'volume || 5 = 5',
      `name ?? 'Guest' = ""`,
      `name || 'Guest' = "Guest"`,
    ])
    expect(await output(nullishSamples, 'Optional chaining')).toEqual(['city: Singapore', 'city: unknown', 'letters: 9', 'letters: undefined'])
  })

  it('Arrays, sets & maps: copies and insertion order', async () => {
    expect(await output(collectionsSamples, 'Arrays')).toEqual([
      'sorted: C, Rust, TypeScript',
      'editable: Rust, TypeScript, C, Swift',
      'original: Rust, TypeScript, C',
    ])
    expect(await output(collectionsSamples, 'Maps')).toEqual(['apple: 2', 'pear: 0', 'kiwi: 5', 'plum: 0'])
    expect(await output(collectionsSamples, 'Copies are shallow')).toEqual(['original: Lin', 'deep copy: Ada'])
  })

  it('Functions & closures: each closure keeps its own state', async () => {
    expect(await output(functionsSamples, 'Closures capture variables')).toEqual(['first: 1, 2, 3', 'second: 1, 2'])
    expect(await output(functionsSamples, 'Default and optional parameters')).toEqual(['Hello, Ada!', 'Welcome, Ada!', 'Hello, Lin?'])
  })

  it('Objects, classes & enums: spread copies, assignment shares', async () => {
    expect(await output(classesSamples, 'Values and references')).toEqual([
      'spread copy: original 0, copy 99',
      'alias: original 99, alias 99',
      'same object: true',
    ])
    expect(await output(classesSamples, 'Discriminated unions')).toEqual(['card ending 1234', 'cash 20', 'voucher'])
    expect(await output(classesSamples, 'Enums with as const')).toEqual(['mercury: 0 moons', 'earth: 1 moons', 'mars: 2 moons'])
  })

  it('Interfaces & generics: shapes and type parameters', async () => {
    expect(await output(genericsSamples, 'Structural typing')).toEqual(['Hello, R2', 'Hello, Ada'])
    expect(await output(genericsSamples, 'Generic functions')).toEqual(['largest number: 9', 'largest word: pear', 'largest of none: undefined'])
  })

  it('Error handling: finally runs before the caller continues', async () => {
    expect(await output(errorsSamples, 'try, catch, and finally')).toEqual([
      'parsed "12"',
      "parse('12') = 12",
      'parsed "twelve"',
      "parse('twelve') = -1",
    ])
    expect(await output(errorsSamples, 'finally for cleanup')).toEqual([
      'open "Ada"', 'processed ada', 'close "Ada"', 'result: ok',
      'open ""', 'failed: empty', 'close ""', 'result: error',
    ])
    expect(await output(errorsSamples, 'unknown in catch')).toEqual(['SyntaxError', 'non-error value: just a string'])
  })

  it('Promises & async/await: results do not depend on timing', async () => {
    expect(await output(promisesSamples, 'Promise.all')).toEqual(['total: 140', 'three 0.2 s waits overlapped: true'])
    expect(await output(promisesSamples, 'Promise.allSettled')).toEqual(['Ada ok', 'rejected: Li is too short', 'Grace ok'])
    expect(await output(promisesSamples, 'Cancellation with AbortController')).toEqual(['stopped: cancelled', 'stopped early: true'])
    expect(await output(promisesSamples, 'The event loop')).toEqual([
      '1: synchronous code',
      '2: promise callback (a microtask)',
      '3: timer callback (a task)',
    ])
  })

  it('Iterators & generators: values on demand', async () => {
    expect(await output(iteratorsSamples, 'Generators')).toEqual([
      '3, 2, 1',
      '{"value":2,"done":false}',
      '{"value":1,"done":false}',
      '{"done":true}',
    ])
    expect(await output(iteratorsSamples, 'Lazy, infinite sequences')).toEqual(['first five squares: 1, 4, 9, 16, 25'])
  })

  it('Strings & regex: UTF-16 units, not characters', async () => {
    const counts = await output(stringsSamples, 'Characters and Unicode')
    expect(counts).toHaveLength(3)
    expect(counts[0]).toMatch(/length 4, 4 code points, 5 UTF-8 bytes$/)
    expect(counts[1]).toMatch(/length 2, 2 code points, 3 UTF-8 bytes$/)
    expect(counts[2]).toMatch(/length 4, 2 code points, 8 UTF-8 bytes$/)
    expect(await output(stringsSamples, 'Tagged templates and String.raw')).toEqual(['hello, ADA!', 'C:\\new\\table'])
    expect((await output(stringsSamples, 'Regex and named groups'))[0]).toBe('year: 2026')
    expect((await output(stringsSamples, 'Comparing strings')).slice(0, 2)).toEqual(['=== : false', 'after normalize: true'])
  })
})
