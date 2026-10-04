import { useState } from 'react'
import { type InfoRow, readBrowserInfo } from './browserInfoRepository'

export function BrowserInfoScreen() {
  // Read once when the screen opens; values do not update while it is shown.
  const [info] = useState(() => readBrowserInfo())
  return (
    <div className="flex flex-col gap-[18px] px-5 pb-8">
      <p className="pt-1 text-on-surface-variant">A snapshot of the browser and device this page is running on.</p>
      <InfoSection title="Browser" rows={info.browser} />
      <InfoSection title="Device" rows={info.device} />
    </div>
  )
}

function InfoSection({ title, rows }: { title: string; rows: InfoRow[] }) {
  return (
    <section className="rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]">
      <h2 className="pb-2 font-semibold">{title}</h2>
      <dl className="divide-y divide-outline-variant/50">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-2.5">
            <dt className="text-on-surface-variant">{row.label}</dt>
            <dd className="text-right font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
