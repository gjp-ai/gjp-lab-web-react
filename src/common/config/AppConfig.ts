/** Stable application behaviour, shared with the iOS and Android labs. */
export const AppConfig = {
  /** The splash stays at least this long, even when the maintenance check is faster. */
  minimumSplashMs: 3_000,
  /** The maintenance check gives up after this long and opens the app. */
  remoteConfigTimeoutMs: 5_000,
  /**
   * Where the maintenance flag is read from. The bundled file is the default; point VITE_REMOTE_CONFIG_URL
   * at a server to switch maintenance on without a new build.
   */
  remoteConfigUrl: import.meta.env.VITE_REMOTE_CONFIG_URL ?? `${import.meta.env.BASE_URL}remote-config.json`,
} as const
