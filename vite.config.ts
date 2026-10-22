import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';
const isTest = process.env.VITE_APP_CHANNEL === 'test';
const appName = isTest ? 'My D&D Test' : 'My D&D';
const sourceSha = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const manifest = JSON.parse(readFileSync(new URL('./public/manifest.webmanifest', import.meta.url), 'utf8'));
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(sourceSha.slice(0,7)) },
  build: { rollupOptions: { output: { manualChunks: { 'srd-spells':['./src/data/srd-spells.json'], 'srd-features':['./src/data/srd-features.json'], 'srd-equipment':['./src/data/srd-equipment.json'] } } } },
  plugins: [{
    name: 'app-identity',
    transformIndexHtml: html => html.replace(/<title>.*?<\/title>/, `<title>${appName}</title>`)
      .replace(/name="apple-mobile-web-app-title" content="[^"]*"/, `name="apple-mobile-web-app-title" content="${appName}"`),
    generateBundle() {
      this.emitFile({type:'asset', fileName:'manifest.webmanifest', source:JSON.stringify({...manifest, name:appName, short_name:appName,
        ...(isTest ? {description:'Testversjon av D&D-karakterarket. Egne lokale testdata.'} : {})})});
      // Stable public URLs; the test build keeps the same filenames with its TEST artwork.
      for (const [name,source] of Object.entries({
        'icon-192.png': 'journal-192.png', 'icon-512.png':'journal-512.png',
        'apple-touch-icon.png':'journal-180.png', 'icon-maskable-512.png':'round-512.png',
      })) this.emitFile({type:'asset',fileName:name,source:readFileSync(new URL(`./assets/app-icons/${isTest?'test':'app'}/${source}`,import.meta.url))});
      this.emitFile({type:'asset',fileName:'environment-layout.json',source:JSON.stringify({version:2,channel:isTest?'test':'production',sha:sourceSha})});
    },
  }, VitePWA({
    registerType: 'prompt',
    injectRegister: false,
    manifest: false,
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,txt,ttf}'],
      cacheId: isTest ? 'my-dnd-test' : 'my-dnd-production',
      // Do not delete any other registration's cache, including during migration.
      cleanupOutdatedCaches: false,
      // Also protects the old test URL while this PR is previewed before migration.
      navigateFallbackDenylist: isTest ? [/\/my-dnd\/app\//] : [/\/test(?:\/|$)/, /\/my-dnd\/test-app\//],
      clientsClaim: true, importScripts: ['sw-messages.js'],
    },
  })],
});
