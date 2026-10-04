export interface SignUpValues {
  email: string
  password: string
}

/** One message per invalid field; an empty object means the form can be submitted. */
export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>

export function validateSignUp(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {}
  const email = values.email.trim()
  if (email === '') errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter an email address like name@example.com.'

  if (values.password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (!/\d/.test(values.password)) errors.password = 'Include at least one number.'
  return errors
}
