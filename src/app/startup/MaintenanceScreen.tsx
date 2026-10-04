import { LabButton } from '@/common/theme/LabButton'

/** Shown instead of the app while the maintenance flag is on. Try again re-checks the flag. */
export function MaintenanceScreen({ onRetry, isRetrying }: { onRetry: () => void; isRetrying: boolean }) {
  return (
    <main className="flex h-full items-center justify-center bg-background p-7">
      <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
        <svg viewBox="0 0 24 24" className="size-9 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />
        </svg>
        <h1 className="text-3xl font-bold">We'll be back soon</h1>
        <p className="text-on-surface-variant">
          GJP Lab is temporarily unavailable while we perform maintenance. Please try again shortly.
        </p>
        <LabButton onClick={onRetry} disabled={isRetrying} className="mt-2.5">
          {isRetrying ? 'Checking…' : 'Try again'}
        </LabButton>
      </div>
    </main>
  )
}
