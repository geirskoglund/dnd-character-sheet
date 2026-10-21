import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';
const isTest = process.env.VITE_APP_CHANNEL === 'test';
const manifest = JSON.parse(readFileSync(new URL('./public/manifest.webmanifest', import.meta.url), 'utf8'));
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim()) },
  build: { rollupOptions: { output: { manualChunks: { 'srd-spells':['./src/data/srd-spells.json'], 'srd-features':['./src/data/srd-features.json'], 'srd-equipment':['./src/data/srd-equipment.json'] } } } },
  plugins: [{
    name: 'test-app-identity',
    transformIndexHtml: html => isTest ? html.replace(/<title>.*?<\/title>/, '<title>My D&D Test</title>') : html,
    generateBundle() {
      if (isTest) this.emitFile({type:'asset', fileName:'manifest.webmanifest', source:JSON.stringify({...manifest, name:'My D&D Test', short_name:'My D&D Test', description:'Testversjon av D&D-karakterarket. Egne lokale testdata.'})});
    },
  }, VitePWA({
    registerType: 'prompt',
    injectRegister: false,
    manifest: false,
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,webmanifest,txt,ttf}'],
      cacheId: isTest ? 'my-dnd-test' : 'my-dnd-production',
      // Workbox's broad outdated-cache cleanup also matches nested scopes.
      // PrecacheController still removes obsolete entries from its own cache.
      cleanupOutdatedCaches: false,
      navigateFallbackDenylist: isTest ? [] : [/\/test(?:\/|$)/],
      clientsClaim: true, importScripts: ['sw-messages.js'],
    },
  })],
});
