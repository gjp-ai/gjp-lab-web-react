/// <reference types="vitest/config" />
import { createHash } from 'node:crypto'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { inlineScripts, serializePolicy, sitePolicy } from './src/common/config/contentSecurityPolicy.ts'

/**
 * Adds the site's Content Security Policy to the built index.html, first in <head> so it covers everything
 * after it, with the SHA-256 hash of each inline script. Build only: the dev server injects inline scripts
 * for hot reload, which a policy would block.
 */
function contentSecurityPolicy(): Plugin {
  return {
    name: 'gjp-lab-content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = inlineScripts(html).map((code) => `sha256-${createHash('sha256').update(code).digest('base64')}`)
        return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: serializePolicy(sitePolicy, hashes) }, injectTo: 'head-prepend' }]
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // The app is served from https://<host>/lab/react/. Vite prefixes every asset URL with this, and
  // import.meta.env.BASE_URL carries it to the code (the router's basename and the maintenance flag URL).
  base: '/lab/react/',
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
