import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { errorsSamples } from './ErrorsSamples'

export function ErrorsScreen() {
  return (
    <CodeSamplePage
      intro="JavaScript reports failures by throwing. TypeScript treats a caught value as unknown until you check it."
      samples={errorsSamples}
    />
  )
}
