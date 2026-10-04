export interface FeedbackReceipt {
  ticket: string
  topic: string
}

let nextTicket = 1

/**
 * Pretends to send feedback to a server: waits `latencyMs`, then returns a ticket number. Nothing leaves
 * the browser, so the demo works offline and tests stay deterministic.
 */
export async function sendFeedback(topic: string, message: string, latencyMs: number): Promise<FeedbackReceipt> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs))
  if (message.trim() === '') throw new Error('Write a message before sending.')
  return { ticket: `FB-${String(nextTicket++).padStart(4, '0')}`, topic }
}
