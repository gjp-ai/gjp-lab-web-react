/**
 * Reads the maintenance flag from a small JSON file such as `{ "maintenanceEnabled": false }`. This is
 * the web stand-in for Firebase Remote Config in the iOS and Android labs. Any failure, timeout, or
 * unexpected content fails open to `false`, so a broken config never locks users out.
 */
export async function fetchMaintenanceMode(
  url: string,
  timeoutMs: number,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), cache: 'no-store' })
    if (!response.ok) return false
    const body: unknown = await response.json()
    return typeof body === 'object' && body !== null && (body as { maintenanceEnabled?: unknown }).maintenanceEnabled === true
  } catch {
    return false
  }
}
