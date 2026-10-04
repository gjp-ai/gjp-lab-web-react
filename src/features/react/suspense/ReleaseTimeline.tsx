const majors = [
  { version: '0.3', year: 2013 },
  { version: '15', year: 2016 },
  { version: '16', year: 2017 },
  { version: '17', year: 2020 },
  { version: '18', year: 2022 },
  { version: '19', year: 2024 },
]

const firstYear = 2013
const lastYear = 2024

/**
 * Loaded with React.lazy, so this file is its own chunk: the browser downloads it only when the
 * Suspense demo first shows it.
 */
export function ReleaseTimeline() {
  return (
    <ol aria-label="React major releases" className="flex flex-col gap-1.5">
      {majors.map((major) => (
        <li key={major.version} className="flex items-center gap-3 text-sm">
          <span className="w-10 shrink-0 font-semibold">{major.version}</span>
          <span className="h-3 rounded-full bg-primary" style={{ width: `${8 + ((major.year - firstYear) / (lastYear - firstYear)) * 72}%` }} aria-hidden="true" />
          <span className="text-on-surface-variant">{major.year}</span>
        </li>
      ))}
    </ol>
  )
}
