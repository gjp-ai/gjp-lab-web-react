import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { functionsSamples } from './FunctionsSamples'

export function FunctionsScreen() {
  return (
    <CodeSamplePage
      intro="Functions are values in JavaScript: pass them, return them, and write them inline as arrow functions."
      samples={functionsSamples}
    />
  )
}
