import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { iteratorsSamples } from './IteratorsSamples'

export function IteratorsScreen() {
  return (
    <CodeSamplePage
      intro="Iterables feed for…of, spread, and destructuring; generators produce values one at a time, on demand."
      samples={iteratorsSamples}
    />
  )
}
