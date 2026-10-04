import { describe, expect, it } from 'vitest'
import { formatBytes, reasonPhrase } from './HttpResponse'

describe('reasonPhrase', () => {
  it('names common statuses and leaves others empty', () => {
    expect(reasonPhrase(201)).toBe('Created')
    expect(reasonPhrase(404)).toBe('Not Found')
    expect(reasonPhrase(299)).toBe('')
  })
})

describe('formatBytes', () => {
  it('uses B, KB, or MB', () => {
    expect(formatBytes(292)).toBe('292 B')
    expect(formatBytes(2726)).toBe('2.7 KB')
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB')
  })
})
