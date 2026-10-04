import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { collectionsSamples } from './CollectionsSamples'

export function CollectionsScreen() {
  return (
    <CodeSamplePage
      intro="Arrays, sets, and maps hold collections of values; array methods transform them without loops."
      samples={collectionsSamples}
    />
  )
}
