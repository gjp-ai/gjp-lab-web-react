export type ReactVersion = '18' | '19'

export interface ReleaseNotes {
  version: ReactVersion
  released: string
  highlights: string[]
}

const notes: Record<ReactVersion, ReleaseNotes> = {
  '18': {
    version: '18',
    released: 'March 2022',
    highlights: ['Concurrent rendering', 'Automatic batching of state updates', 'Transitions with startTransition', 'Streaming server rendering with Suspense'],
  },
  '19': {
    version: '19',
    released: 'December 2024',
    highlights: ['Actions, useActionState, and useOptimistic', 'The use API for promises and context', 'ref as an ordinary prop', '<Context> as its own provider'],
  },
}

/** Resolves after `latencyMs`, like a request to a server; the notes are bundled, so nothing is downloaded. */
export async function loadReleaseNotes(version: ReactVersion, latencyMs: number): Promise<ReleaseNotes> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs))
  return notes[version]
}
