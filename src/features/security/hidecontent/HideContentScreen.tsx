import { useEffect, useEffectEvent, useId, useState } from 'react'
import { flushSync } from 'react-dom'
import { browserStorage, type PreferenceStorage } from '@/common/config/preferenceStorage'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { describeChange, type HideReason, hideReasonText, nextShield } from './contentShield'
import { type HideContentSettings, readHideContentSettings, writeHideContentSettings } from './hideContentSettings'
import { type PageActivity, type PageActivityEvent, type PageEnvironment, readPageActivity, watchPageActivity } from './pageActivityRepository'

/** Made-up values standing in for anything a person would not want seen over their shoulder. */
const sampleAccount = [
  { label: 'Card number', value: '4242 4242 4242 4242' },
  { label: 'Balance', value: 'S$ 12,480.50' },
  { label: 'One-time code', value: '482 913' },
]

/** Tests pass a fake page `environment` and `storage`; in the app both are the real browser. */
export function HideContentScreen({ environment, storage }: { environment?: PageEnvironment; storage?: PreferenceStorage }) {
  const [settings, setSettings] = useState(() => readHideContentSettings(storage ?? browserStorage()))
  const [activity, setActivity] = useState(() => readPageActivity(environment))
  const [shield, setShield] = useState(() => nextShield(undefined, activity, settings))
  const [log, setLog] = useState<string[]>([])
  const record = (entry: string) => setLog((list) => [...list.slice(-5), entry])

  // An effect event reads the latest settings and shield, so the listeners are not added again when they change.
  const onActivity = useEffectEvent((next: PageActivity, event: PageActivityEvent) => {
    const after = nextShield(shield, next, settings)
    // Commit inside the event, so the values leave the page before the browser draws the hidden page for its
    // tab overview or app switcher. When it draws is up to the browser.
    flushSync(() => {
      setActivity(next)
      setShield(after)
      record(describeChange(event, shield, after))
    })
  })

  useEffect(() => watchPageActivity((next, event) => onActivity(next, event), environment), [environment])

  const update = (change: Partial<HideContentSettings>) => {
    const next = { ...settings, ...change }
    setSettings(next)
    writeHideContentSettings(storage ?? browserStorage(), next)
  }

  const hideNow = () => {
    setShield('manual')
    record('You hid the content')
  }

  const show = () => {
    setShield(undefined)
    record('You showed the content')
  }

  return (
    <LabDemoPage intro="A page is hidden when you switch tabs, minimise the window, lock the screen, or switch apps on a phone, for example to answer a call. The browser fires visibilitychange, and a page showing sensitive content can take it off the screen until you are back.">
      <LabDemoSection
        title="Sensitive content"
        caption="While hidden, the values are removed from the page, not blurred or covered, so they cannot be read from the page, copied, or announced."
      >
        {shield === undefined ? <AccountCard /> : <HiddenCard reason={shield} />}
        <div>
          {shield === undefined ? (
            <LabButton variant="secondary" onClick={hideNow}>
              Hide now
            </LabButton>
          ) : (
            <LabButton onClick={show}>Show content</LabButton>
          )}
        </div>
        <p role="status" className="sr-only">
          {shield === undefined ? 'Sample content shown.' : 'Sample content hidden.'}
        </p>
      </LabDemoSection>

      <LabDemoSection title="When to hide" caption="Saved in this browser. A change applies from the next time the page is hidden, shown, or loses focus.">
        <div className="flex flex-col gap-3 text-sm">
          <SettingCheckbox
            label="Hide when the page is hidden"
            hint="Another tab, a minimised window, a locked screen, or another app, such as answering a call on a phone."
            checked={settings.whenHidden}
            onChange={(whenHidden) => update({ whenHidden })}
          />
          <SettingCheckbox
            label="Also hide when the window loses focus"
            hint="Another window in front, for example while sharing your screen in a video call. Using the address bar or developer tools counts too."
            checked={settings.whenUnfocused}
            onChange={(whenUnfocused) => update({ whenUnfocused })}
          />
          <SettingCheckbox
            label="Keep hidden until I choose to show it"
            hint="When you come back, the content waits for Show content instead of returning by itself."
            checked={settings.untilShown}
            onChange={(untilShown) => update({ untilShown })}
          />
        </div>
      </LabDemoSection>

      <LabDemoSection
        title="Page activity"
        caption="What the page reads: document.visibilityState, and whether its window has focus. Switch to another tab and back, then read the log."
      >
        <dl aria-label="Page state" className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-surface-container p-3 text-sm text-on-surface">
          <dt className="text-on-surface-variant">Page</dt>
          <dd>{activity.isVisible ? 'Visible' : 'Hidden'}</dd>
          <dt className="text-on-surface-variant">Window</dt>
          <dd>{activity.hasFocus ? 'Focused' : 'Not focused'}</dd>
        </dl>
        <ActivityLog entries={log} />
      </LabDemoSection>

      <LabDemoSection title="What a page cannot detect" caption="Browsers keep these from web pages, so no site can offer them.">
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
          <li>
            <strong>Calls.</strong> No browser API reports a phone or video call. On a phone, answering one usually hides the page, and
            that is what this topic sees.
          </li>
          <li>
            <strong>Screenshots and recordings.</strong> A page is not told when the screen is captured, and cannot prevent it.
          </li>
          <li>
            <strong>The switcher image.</strong> The browser decides when to take the picture in its tab overview or the app switcher,
            so hiding first is best effort.
          </li>
          <li>
            <strong>Covered windows.</strong> A desktop window behind another one may still count as visible; losing focus is the
            closest signal.
          </li>
        </ul>
      </LabDemoSection>
    </LabDemoPage>
  )
}

function AccountCard() {
  return (
    <div className="flex min-h-44 flex-col gap-3 rounded-2xl bg-primary p-5 text-on-primary">
      <p className="text-sm font-semibold">Sample account (made-up data)</p>
      <dl className="flex flex-col gap-2">
        {sampleAccount.map((row) => (
          <div key={row.label} className="flex flex-col">
            <dt className="text-sm">{row.label}</dt>
            <dd className="font-mono text-lg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function HiddenCard({ reason }: { reason: HideReason }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant bg-surface-container p-5 text-center text-on-surface">
      <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <p className="font-semibold">Content hidden</p>
      <p className="text-sm text-on-surface-variant">{hideReasonText[reason]}</p>
    </div>
  )
}

function SettingCheckbox({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const hintId = useId()
  return (
    <div className="flex flex-col gap-0.5">
      <label className="flex items-center gap-2 font-medium">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-describedby={hintId} className="size-4" />
        {label}
      </label>
      <p id={hintId} className="pl-6 text-on-surface-variant">
        {hint}
      </p>
    </div>
  )
}

function ActivityLog({ entries }: { entries: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold">Activity log</h3>
      <ol className="flex flex-col gap-0.5 rounded-lg bg-surface-container p-3 font-mono text-xs text-on-surface">
        {entries.length === 0 ? <li className="text-on-surface-variant">Nothing yet</li> : entries.map((entry, index) => <li key={index}>{entry}</li>)}
      </ol>
    </div>
  )
}
