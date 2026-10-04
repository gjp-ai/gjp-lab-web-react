import { describe, expect, it } from 'vitest'
import { packages, saveProjectName, sendMessage } from './projectRepository'

describe('projectRepository', () => {
  it('saves a trimmed name and rejects a short one', async () => {
    await expect(saveProjectName('  Lab  ', 0)).resolves.toBe('Lab')
    await expect(saveProjectName('ab', 0)).rejects.toThrow('A project name needs at least 3 characters.')
  })

  it('sends a message unless it contains "fail"', async () => {
    await expect(sendMessage('Hello', 0)).resolves.toMatchObject({ text: 'Hello' })
    await expect(sendMessage('please FAIL', 0)).rejects.toThrow('could not be sent')
  })

  it('has a long list of package names', () => {
    expect(packages).toHaveLength(300)
    expect(packages[0]).toBe('package-001')
  })
})
