import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { genericsSamples } from './GenericsSamples'

export function GenericsScreen() {
  return (
    <CodeSamplePage
      intro="Interfaces describe shapes; generics let one piece of code work with many types, checked by the compiler."
      samples={genericsSamples}
    />
  )
}
