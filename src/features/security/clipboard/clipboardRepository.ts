/** The parts of the browser the clipboard topic uses, so tests can pass a fake. */
export interface ClipboardEnvironment {
  /** Missing outside a secure context (HTTPS or localhost). */
  clipboard: Pick<Clipboard, 'readText' | 'writeText'> | undefined
  permissions: Pick<Permissions, 'query'> | undefined
  isSecureContext: boolean
}

export function browserClipboardEnvironment(): ClipboardEnvironment {
  return { clipboard: navigator.clipboard, permissions: navigator.permissions, isSecureContext: window.isSecureContext }
}

export type CopyOutcome = { ok: true } | { ok: false; reason: string }
export type ReadOutcome = { ok: true; text: string } | { ok: false; reason: string }

/** Writes text to the clipboard. An empty string clears it. */
export async function copyText(text: string, environment: ClipboardEnvironment = browserClipboardEnvironment()): Promise<CopyOutcome> {
  if (environment.clipboard === undefined) return { ok: false, reason: unavailableReason(environment) }
  try {
    await environment.clipboard.writeText(text)
    return { ok: true }
  } catch (error) {
    return { ok: false, reason: refusalReason(error, 'The browser refused: writing needs a recent click on this page while it has focus.') }
  }
}

/** Reads the clipboard's text. The browser asks the person first, or refuses. */
export async function readText(environment: ClipboardEnvironment = browserClipboardEnvironment()): Promise<ReadOutcome> {
  if (environment.clipboard === undefined) return { ok: false, reason: unavailableReason(environment) }
  try {
    return { ok: true, text: await environment.clipboard.readText() }
  } catch (error) {
    return { ok: false, reason: refusalReason(error, 'The browser refused: permission was denied, or the paste prompt was dismissed.') }
  }
}

export type ClipboardPermission = 'clipboard-read' | 'clipboard-write'
export type PermissionView = PermissionState | 'unsupported'

/**
 * Reports a clipboard permission's state now and whenever it changes (for example in site settings).
 * Browsers that do not know the permission name, such as Firefox and Safari, report `unsupported`.
 * Returns a function that stops listening.
 */
export function watchPermission(
  name: ClipboardPermission,
  onState: (state: PermissionView) => void,
  environment: ClipboardEnvironment = browserClipboardEnvironment(),
): () => void {
  let isCurrent = true
  let status: PermissionStatus | undefined
  const onChange = () => {
    if (status !== undefined) onState(status.state)
  }
  if (environment.permissions === undefined) {
    onState('unsupported')
  } else {
    // TypeScript's PermissionName lists only names every browser supports; Chromium also knows the clipboard ones.
    void environment.permissions.query({ name: name as PermissionName }).then(
      (result) => {
        if (!isCurrent) return
        status = result
        onState(result.state)
        result.addEventListener('change', onChange)
      },
      () => {
        if (isCurrent) onState('unsupported')
      },
    )
  }
  return () => {
    isCurrent = false
    status?.removeEventListener('change', onChange)
  }
}

function unavailableReason(environment: ClipboardEnvironment): string {
  return environment.isSecureContext ? 'This browser has no Clipboard API.' : 'The Clipboard API works only on secure pages (HTTPS or localhost).'
}

function refusalReason(error: unknown, notAllowed: string): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') return notAllowed
  return error instanceof Error ? error.message : 'The clipboard could not be used.'
}
