/** What the payload field holds: nothing, valid JSON (with a formatted copy), or other text. */
export type PayloadCheck = { kind: 'empty' } | { kind: 'json'; formatted: string } | { kind: 'text' }

/**
 * Checks the payload as the person types. Text that is not JSON is still sent as typed, so this only
 * informs; it never blocks sending.
 */
export function checkPayload(payload: string): PayloadCheck {
  if (payload.trim() === '') return { kind: 'empty' }
  try {
    return { kind: 'json', formatted: JSON.stringify(JSON.parse(payload), null, 2) }
  } catch {
    return { kind: 'text' }
  }
}
