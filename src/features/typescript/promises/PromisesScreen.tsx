import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { promisesSamples } from './PromisesSamples'

export function PromisesScreen() {
  return (
    <CodeSamplePage
      intro="Promises represent work that finishes later; async and await make that code read top to bottom."
      samples={promisesSamples}
    />
  )
}
