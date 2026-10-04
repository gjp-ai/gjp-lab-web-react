import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { classesSamples } from './ClassesSamples'

export function ClassesScreen() {
  return (
    <CodeSamplePage
      intro="Object types describe data, classes add behaviour, and unions model a fixed set of cases."
      samples={classesSamples}
    />
  )
}
