import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim()) },
  plugins: [VitePWA({
    registerType: 'prompt',
    injectRegister: false,
    manifest: false,
    workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest,txt}'], cleanupOutdatedCaches: true, clientsClaim: true, importScripts: ['sw-messages.js'] },
  })],
});
