import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
// Adds DOM matchers such as toBeInTheDocument() to Vitest's expect.
import '@testing-library/jest-dom/vitest'

// Testing Library only cleans up automatically when Vitest globals are on; unmount after every test.
afterEach(() => cleanup())
