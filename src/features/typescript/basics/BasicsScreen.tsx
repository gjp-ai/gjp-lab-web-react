import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { basicsSamples } from './BasicsSamples'

export function BasicsScreen() {
  return (
    <CodeSamplePage
      intro="TypeScript adds static types to JavaScript: every value has a type the compiler checks, usually inferred from the value itself."
      samples={basicsSamples}
    />
  )
}
