/**
 * A pretend server for the transitions demos. Each call waits `latencyMs` and then succeeds or fails by
 * simple rules, so the demos can show pending, success, and error states without a network.
 */
async function respond(latencyMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs))
}

/** Saves a project name; names shorter than 3 characters are rejected. Returns the saved name. */
export async function saveProjectName(name: string, latencyMs: number): Promise<string> {
  await respond(latencyMs)
  const trimmed = name.trim()
  if (trimmed.length < 3) throw new Error('A project name needs at least 3 characters.')
  return trimmed
}

export interface Message {
  id: string
  text: string
}

let nextMessageId = 1

/** Sends a chat message; a message containing "fail" is rejected, to show a rollback. */
export async function sendMessage(text: string, latencyMs: number): Promise<Message> {
  await respond(latencyMs)
  if (/fail/i.test(text)) throw new Error(`“${text}” could not be sent.`)
  return { id: `m${nextMessageId++}`, text }
}

/** A list long enough that filtering it renders noticeably slower than a keystroke. */
export const packages: readonly string[] = Array.from({ length: 300 }, (_, index) => `package-${String(index + 1).padStart(3, '0')}`)
