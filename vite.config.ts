import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim()) },
  build: { rollupOptions: { output: { manualChunks: { 'srd-spells':['./src/data/srd-spells.json'], 'srd-features':['./src/data/srd-features.json'], 'srd-equipment':['./src/data/srd-equipment.json'] } } } },
  plugins: [VitePWA({
    registerType: 'prompt',
    injectRegister: false,
    manifest: false,
    workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest,txt}'], cleanupOutdatedCaches: true, clientsClaim: true, importScripts: ['sw-messages.js'] },
  })],
});
