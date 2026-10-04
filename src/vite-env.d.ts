/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional URL of the maintenance-flag JSON; defaults to the bundled public/remote-config.json. */
  readonly VITE_REMOTE_CONFIG_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
