import { lazy, Suspense, use, useState, useTransition } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { loadReleaseNotes, type ReactVersion, type ReleaseNotes } from './releaseRepository'

/** `latencyMs` is how long the pretend download and server take; tests pass 0. */
export function SuspenseScreen({ latencyMs = 1000 }: { latencyMs?: number }) {
  return (
    <LabDemoPage intro="Suspense shows a fallback while something below it is not ready yet: code that is still downloading, or data that is still loading. The rest of the page stays usable.">
      <LazyDemo latencyMs={latencyMs} />
      <DataDemo latencyMs={latencyMs} />
      <TransitionDemo latencyMs={latencyMs} />
    </LabDemoPage>
  )
}

function LazyDemo({ latencyMs }: { latencyMs: number }) {
  const [isShown, setIsShown] = useState(false)
  // Created once per screen. The wait only makes the download visible; the import itself is real.
  const [ReleaseTimeline] = useState(() =>
    lazy(async () => {
      await new Promise((resolve) => setTimeout(resolve, latencyMs))
      const module = await import('./ReleaseTimeline')
      return { default: module.ReleaseTimeline }
    }),
  )

  return (
    <LabDemoSection
      title="Lazy-loaded components"
      caption="lazy(() => import('./ReleaseTimeline')) splits the timeline into its own file. The first time it is shown, Suspense shows the fallback until the file arrives; after that it is ready at once."
    >
      <div>
        <LabButton onClick={() => setIsShown((value) => !value)}>{isShown ? 'Hide timeline' : 'Show timeline'}</LabButton>
      </div>
      {isShown && (
        <Suspense fallback={<Fallback text="Loading the timeline code…" />}>
          <ReleaseTimeline />
        </Suspense>
      )}
    </LabDemoSection>
  )
}

function DataDemo({ latencyMs }: { latencyMs: number }) {
  // The promise is created in an event handler (or once, here) and kept in state, never created while rendering.
  const [notes, setNotes] = useState(() => loadReleaseNotes('19', latencyMs))
  return (
    <LabDemoSection
      title="Waiting for data with use()"
      caption="ReleaseCard calls use(promise). Until the promise resolves, the component suspends and the nearest Suspense boundary shows its fallback instead."
    >
      <VersionButtons onChoose={(version) => setNotes(loadReleaseNotes(version, latencyMs))} />
      <Suspense fallback={<Fallback text="Loading release notes…" />}>
        <ReleaseCard notes={notes} />
      </Suspense>
    </LabDemoSection>
  )
}

function TransitionDemo({ latencyMs }: { latencyMs: number }) {
  const [notes, setNotes] = useState(() => loadReleaseNotes('18', latencyMs))
  const [isPending, startTransition] = useTransition()
  return (
    <LabDemoSection
      title="Keep showing the old content"
      caption="Here the new promise is set inside startTransition. React keeps the current notes on screen, dimmed by isPending, instead of replacing them with the fallback."
    >
      <VersionButtons onChoose={(version) => startTransition(() => setNotes(loadReleaseNotes(version, latencyMs)))} />
      <div className={isPending ? 'opacity-50 transition-opacity' : 'transition-opacity'} aria-busy={isPending}>
        <Suspense fallback={<Fallback text="Loading release notes…" />}>
          <ReleaseCard notes={notes} />
        </Suspense>
      </div>
    </LabDemoSection>
  )
}

function VersionButtons({ onChoose }: { onChoose: (version: ReactVersion) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <LabButton variant="secondary" onClick={() => onChoose('18')}>
        React 18
      </LabButton>
      <LabButton variant="secondary" onClick={() => onChoose('19')}>
        React 19
      </LabButton>
    </div>
  )
}

function ReleaseCard({ notes }: { notes: Promise<ReleaseNotes> }) {
  const release = use(notes)
  return (
    <article className="flex flex-col gap-2 rounded-xl bg-surface-container px-4 py-3 text-on-surface">
      <h3 className="font-semibold">
        React {release.version} <span className="font-normal text-on-surface-variant">· {release.released}</span>
      </h3>
      <ul className="list-disc pl-5 text-sm">
        {release.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  )
}

function Fallback({ text }: { text: string }) {
  return (
    <p role="status" className="flex items-center gap-2 rounded-xl border border-dashed border-outline-variant px-4 py-3 text-sm text-on-surface-variant">
      <span className="size-3 animate-pulse rounded-full bg-on-surface-variant motion-reduce:animate-none" aria-hidden="true" />
      {text}
    </p>
  )
}
