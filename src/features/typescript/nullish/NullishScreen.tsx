import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { nullishSamples } from './NullishSamples'

export function NullishScreen() {
  return (
    <CodeSamplePage
      intro="TypeScript tracks null and undefined in the type, and makes you handle them before using a value."
      samples={nullishSamples}
    />
  )
}
