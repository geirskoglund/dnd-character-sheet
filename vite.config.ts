import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: './',
  plugins: [VitePWA({
    registerType: 'prompt',
    manifest: false,
    workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest,txt}'], cleanupOutdatedCaches: true },
  })],
});
