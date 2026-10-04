import { useEffect, useRef, useState } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import {
  browserClipboardEnvironment,
  type ClipboardEnvironment,
  copyText,
  type PermissionView,
  readText,
  watchPermission,
} from './clipboardRepository'

/** A made-up code standing in for a password or one-time code. */
const sampleCode = '730 214'
const previewLength = 120

/** Tests pass a fake `environment` and a shorter `clearAfterSeconds`; in the app they are the browser and 20 s. */
export function ClipboardScreen({ environment, clearAfterSeconds = 20 }: { environment?: ClipboardEnvironment; clearAfterSeconds?: number }) {
  // Kept in state, so effects that depend on it do not run again on every render.
  const [clipboardEnvironment] = useState(() => environment ?? browserClipboardEnvironment())
  return (
    <LabDemoPage intro="The clipboard carries passwords, codes, and personal details between apps, so browsers guard it. A page may write to it during a click, and may read it only when the person agrees.">
      <CopyDemo environment={clipboardEnvironment} />
      <SecretDemo environment={clipboardEnvironment} clearAfterSeconds={clearAfterSeconds} />
      <PasteDemo environment={clipboardEnvironment} />
      <PermissionsDemo environment={clipboardEnvironment} />
      <LabDemoSection title="What a page cannot do" caption="Browsers keep these out of reach, and clearing has limits.">
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
          <li>
            <strong>Read without asking.</strong> Every read needs a click, then permission or a Paste button; a page cannot read the
            clipboard in the background.
          </li>
          <li>
            <strong>See other copies.</strong> A page is not told when you copy something in another app or tab.
          </li>
          <li>
            <strong>Erase every copy.</strong> Clearing does not remove clipboard history (Windows + V) or copies synced to other devices.
          </li>
          <li>
            <strong>Check before clearing.</strong> Knowing whether the clipboard still holds the code would need read permission, so
            clearing may replace something you copied since.
          </li>
        </ul>
      </LabDemoSection>
    </LabDemoPage>
  )
}

function CopyDemo({ environment }: { environment: ClipboardEnvironment }) {
  const [text, setText] = useState('Hello from GJP Lab')
  const [status, setStatus] = useState('')

  const copy = async () => {
    const outcome = await copyText(text, environment)
    setStatus(outcome.ok ? 'Copied. Paste it anywhere to check.' : outcome.reason)
  }

  return (
    <LabDemoSection title="Copy text" caption="navigator.clipboard.writeText copies text. Browsers allow it during a click on the page, and only on HTTPS or localhost.">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-on-surface-variant">Text to copy</span>
        <input value={text} onChange={(event) => setText(event.target.value)} className={labInputClassName} />
      </label>
      <div>
        <LabButton onClick={() => void copy()}>Copy</LabButton>
      </div>
      <p role="status" className="text-sm">
        {status}
      </p>
    </LabDemoSection>
  )
}

function SecretDemo({ environment, clearAfterSeconds }: { environment: ClipboardEnvironment; clearAfterSeconds: number }) {
  const [clearIn, setClearIn] = useState<number>()
  const [status, setStatus] = useState('')
  // Whether the clipboard may still hold the code, so leaving the topic can clear it.
  const holdsCode = useRef(false)

  const copyCode = async () => {
    const outcome = await copyText(sampleCode, environment)
    if (!outcome.ok) {
      setStatus(outcome.reason)
      return
    }
    holdsCode.current = true
    setClearIn(clearAfterSeconds)
    setStatus(`Copied. The clipboard clears in ${clearAfterSeconds} seconds.`)
  }

  const clearNow = async () => {
    const outcome = await copyText('', environment)
    if (outcome.ok) holdsCode.current = false
    setClearIn(undefined)
    setStatus(outcome.ok ? 'Cleared the clipboard.' : outcome.reason)
  }

  // Counts down one second at a time, then clears. Without a recent click, Safari and Firefox refuse to write,
  // and Chromium needs the page to have focus, so clearing by itself can fail.
  useEffect(() => {
    if (clearIn === undefined) return
    if (clearIn > 0) {
      const id = setTimeout(() => setClearIn(clearIn - 1), 1000)
      return () => clearTimeout(id)
    }
    let isCurrent = true
    void copyText('', environment).then((outcome) => {
      if (!isCurrent) return
      if (outcome.ok) holdsCode.current = false
      setClearIn(undefined)
      setStatus(outcome.ok ? 'Cleared the clipboard.' : `Could not clear it by itself. ${outcome.reason} Select Clear now.`)
    })
    return () => {
      isCurrent = false
    }
  }, [clearIn, environment])

  // Leaving the topic clears a code that may still be on the clipboard; the click that leaves usually counts as
  // the recent click browsers ask for.
  useEffect(
    () => () => {
      if (holdsCode.current) void copyText('', environment)
    },
    [environment],
  )

  return (
    <LabDemoSection
      title="Copy a secret, then clear it"
      caption="Like a password manager, the page clears the clipboard a short time after you copy the sample code, and when you leave this topic."
    >
      <p className="text-sm">
        One-time code (made-up): <strong className="font-mono text-base">{sampleCode}</strong>
      </p>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={() => void copyCode()}>Copy code</LabButton>
        <LabButton variant="secondary" onClick={() => void clearNow()}>
          Clear now
        </LabButton>
      </div>
      {clearIn !== undefined && clearIn > 0 && <p className="text-sm text-on-surface-variant tabular-nums">Clears in {clearIn} s</p>}
      <p role="status" className="text-sm">
        {status}
      </p>
    </LabDemoSection>
  )
}

function PasteDemo({ environment }: { environment: ClipboardEnvironment }) {
  const [pasteField, setPasteField] = useState('')
  const [received, setReceived] = useState<string>()
  const [status, setStatus] = useState('')

  const read = async () => {
    const outcome = await readText(environment)
    setReceived(outcome.ok ? preview(outcome.text) : undefined)
    setStatus(outcome.ok ? `readText gave the page ${outcome.text.length} characters, after the browser asked you.` : outcome.reason)
  }

  const forget = () => {
    setReceived(undefined)
    setPasteField('')
    setStatus('')
  }

  return (
    <LabDemoSection
      title="Paste"
      caption="Reading is more sensitive than writing, so browsers ask first: Chromium asks for permission once, and Safari and Firefox show a Paste button each time. A paste event needs no permission, because you chose to paste."
    >
      <div>
        <LabButton onClick={() => void read()}>Read the clipboard</LabButton>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-on-surface-variant">Or paste here with Ctrl+V or ⌘V</span>
        <textarea
          rows={2}
          value={pasteField}
          onChange={(event) => setPasteField(event.target.value)}
          onPaste={(event) => {
            const text = event.clipboardData.getData('text/plain')
            setReceived(preview(text))
            setStatus(`The paste event gave the page ${text.length} characters, with no prompt.`)
          }}
          className={labInputClassName}
        />
      </label>
      <p role="status" className="text-sm">
        {status}
      </p>
      {received !== undefined && (
        <div className="flex flex-col gap-2">
          <pre aria-label="Clipboard text" className="rounded-lg bg-surface-container p-3 font-mono text-xs break-words whitespace-pre-wrap text-on-surface">
            {received}
          </pre>
          <div>
            <LabButton variant="secondary" onClick={forget}>
              Forget it
            </LabButton>
          </div>
        </div>
      )}
    </LabDemoSection>
  )
}

/** The text as shown on the page: shortened, and never stored or sent anywhere. */
function preview(text: string): string {
  if (text === '') return '(empty)'
  return text.length > previewLength ? `${text.slice(0, previewLength)}…` : text
}

const permissionText: Record<PermissionView, string> = {
  granted: 'Granted',
  prompt: 'Asks first',
  denied: 'Denied',
  unsupported: 'Not reported by this browser',
}

function PermissionsDemo({ environment }: { environment: ClipboardEnvironment }) {
  const [readState, setReadState] = useState<PermissionView>()
  const [writeState, setWriteState] = useState<PermissionView>()

  useEffect(() => watchPermission('clipboard-read', setReadState, environment), [environment])
  useEffect(() => watchPermission('clipboard-write', setWriteState, environment), [environment])

  return (
    <LabDemoSection
      title="Permissions"
      caption="What the browser reports through the Permissions API, updated if you change it in site settings. Firefox and Safari do not report clipboard permissions; they decide at each use."
    >
      <dl aria-label="Clipboard access" className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-surface-container p-3 text-sm text-on-surface">
        <dt className="text-on-surface-variant">Secure page</dt>
        <dd>{environment.isSecureContext ? 'Yes' : 'No'}</dd>
        <dt className="text-on-surface-variant">Clipboard API</dt>
        <dd>{environment.clipboard === undefined ? 'Not available' : 'Available'}</dd>
        <dt className="text-on-surface-variant">Read permission</dt>
        <dd>{readState === undefined ? 'Checking…' : permissionText[readState]}</dd>
        <dt className="text-on-surface-variant">Write permission</dt>
        <dd>{writeState === undefined ? 'Checking…' : permissionText[writeState]}</dd>
      </dl>
    </LabDemoSection>
  )
}
