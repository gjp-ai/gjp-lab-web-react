import { describe, expect, it } from 'vitest'
import { checkPayload } from './jsonPayload'

describe('checkPayload', () => {
  it('recognises empty, JSON, and other text', () => {
    expect(checkPayload('  ')).toEqual({ kind: 'empty' })
    expect(checkPayload('{"a":1}')).toEqual({ kind: 'json', formatted: '{\n  "a": 1\n}' })
    expect(checkPayload('{"a":')).toEqual({ kind: 'text' })
  })
})
