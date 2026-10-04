import { CodeSamplePage } from '@/common/codesample/CodeSampleCard'
import { stringsSamples } from './StringsSamples'

export function StringsScreen() {
  return (
    <CodeSamplePage
      intro="Strings are immutable UTF-16 text. Template literals, regular expressions, and normalization cover most text work."
      samples={stringsSamples}
    />
  )
}
