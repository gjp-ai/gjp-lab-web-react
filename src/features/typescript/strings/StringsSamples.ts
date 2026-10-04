import type { CodeSample, SampleLog } from '@/common/codesample/CodeSample'

/**
 * Samples for the Strings & regex topic. Each function below is the code shown in its `CodeSample`; a test
 * checks that every snippet ends with its function's body.
 */
export const stringsSamples: CodeSample[] = [
  {
    title: 'Characters and Unicode',
    explanation: 'length counts UTF-16 units, so accents and emoji can count more than they look; spreading a string counts code points.',
    code: `for (const text of ['café', 'e\\u0301', '👍🏽']) {
  const points = [...text].length
  const bytes = new TextEncoder().encode(text).length
  log(\`\${text}: length \${text.length}, \${points} code points, \${bytes} UTF-8 bytes\`)
}`,
    run: unicode,
  },
  {
    title: 'Tagged templates and String.raw',
    explanation: "A tag function receives a template's text and values separately; String.raw keeps backslashes as written.",
    code: `function shout(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((text, part, i) => text + part + (i < values.length ? String(values[i]).toUpperCase() : ''), '')
}
const name = 'Ada'
log(shout\`hello, \${name}!\`)
log(String.raw\`C:\\new\\table\`)`,
    run: taggedTemplates,
  },
  {
    title: 'Regex and named groups',
    explanation: 'A regular expression finds patterns in text; named groups label each captured part.',
    code: `const date = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/
const match = date.exec('Released on 2026-10-04.')
log(\`year: \${match?.groups?.year}\`)
log(\`month: \${match?.groups?.month}\`)
const all = '2024-01-02 and 2025-03-04'.match(/\\d{4}-\\d{2}-\\d{2}/g)
log(\`all dates: \${all?.join(', ')}\`)`,
    run: regex,
  },
  {
    title: 'Building and padding strings',
    explanation: 'Collect lines in an array and join them; padEnd and padStart line text up.',
    code: `const lines = ['Receipt']
const items: [string, number][] = [
  ['tea', 3],
  ['cake', 5],
]
for (const [item, price] of items) {
  lines.push(\`\${item.padEnd(6, '.')}\${price}\`)
}
lines.push('total: 8')
lines.forEach((line) => log(line))`,
    run: buildingStrings,
  },
  {
    title: 'Comparing strings',
    explanation: '=== compares UTF-16 units, so an accent typed two ways differs until both are normalized; localeCompare sorts by language rules.',
    code: `const composed: string = 'café'
const decomposed: string = 'cafe\\u0301'
log(\`=== : \${composed === decomposed}\`)
log(\`after normalize: \${composed === decomposed.normalize('NFC')}\`)
log(\`ignoring case: \${'TypeScript'.toLowerCase() === 'TYPESCRIPT'.toLowerCase()}\`)
log(\`localeCompare: \${'apple'.localeCompare('Banana', 'en', { sensitivity: 'base' })}\`)`,
    run: comparing,
  },
]

function unicode(log: SampleLog) {
  for (const text of ['café', 'e\u0301', '👍🏽']) {
    const points = [...text].length
    const bytes = new TextEncoder().encode(text).length
    log(`${text}: length ${text.length}, ${points} code points, ${bytes} UTF-8 bytes`)
  }
}

function taggedTemplates(log: SampleLog) {
  function shout(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((text, part, i) => text + part + (i < values.length ? String(values[i]).toUpperCase() : ''), '')
  }
  const name = 'Ada'
  log(shout`hello, ${name}!`)
  log(String.raw`C:\new\table`)
}

function regex(log: SampleLog) {
  const date = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
  const match = date.exec('Released on 2026-10-04.')
  log(`year: ${match?.groups?.year}`)
  log(`month: ${match?.groups?.month}`)
  const all = '2024-01-02 and 2025-03-04'.match(/\d{4}-\d{2}-\d{2}/g)
  log(`all dates: ${all?.join(', ')}`)
}

function buildingStrings(log: SampleLog) {
  const lines = ['Receipt']
  const items: [string, number][] = [
    ['tea', 3],
    ['cake', 5],
  ]
  for (const [item, price] of items) {
    lines.push(`${item.padEnd(6, '.')}${price}`)
  }
  lines.push('total: 8')
  lines.forEach((line) => log(line))
}

function comparing(log: SampleLog) {
  const composed: string = 'café'
  const decomposed: string = 'cafe\u0301'
  log(`=== : ${composed === decomposed}`)
  log(`after normalize: ${composed === decomposed.normalize('NFC')}`)
  log(`ignoring case: ${'TypeScript'.toLowerCase() === 'TYPESCRIPT'.toLowerCase()}`)
  log(`localeCompare: ${'apple'.localeCompare('Banana', 'en', { sensitivity: 'base' })}`)
}
