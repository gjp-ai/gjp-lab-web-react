import { LabMark } from '@/common/theme/LabMark'

/** The branded splash shown while startup decides between the app and maintenance. */
export function SplashScreen() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-5 bg-background" aria-busy="true" aria-label="Loading GJP Lab">
      <div className="flex size-28 items-center justify-center rounded-[32px] bg-primary">
        <LabMark className="size-22 text-on-primary" />
      </div>
      <p className="text-3xl font-bold tracking-[0.15em]">GJP Lab</p>
    </main>
  )
}
