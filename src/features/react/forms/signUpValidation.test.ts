import { describe, expect, it } from 'vitest'
import { validateSignUp } from './signUpValidation'

describe('validateSignUp', () => {
  it('accepts a valid email and password', () => {
    expect(validateSignUp({ email: ' ada@example.com ', password: 'engine42' })).toEqual({})
  })

  it('explains what is wrong with each field', () => {
    expect(validateSignUp({ email: '', password: '' })).toEqual({ email: 'Enter your email address.', password: 'Use at least 8 characters.' })
    expect(validateSignUp({ email: 'ada@', password: 'longenough' })).toEqual({
      email: 'Enter an email address like name@example.com.',
      password: 'Include at least one number.',
    })
  })
})
