/** Retire only the two former registrations and their own Workbox precaches.
 * IndexedDB, localStorage and the new sibling registrations are never removed.
 * Existing windows may finish editing; unregistering does not navigate them.
 */
export async function retireLegacyApps(root) {
  const scopes = [new URL('./', root).href, new URL('test/', root).href];
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(reg => scopes.includes(reg.scope)).map(reg => reg.unregister()));
  }
  if ('caches' in globalThis) {
    const names = await caches.keys();
    await Promise.all(names.filter(name =>
      /^(?:my-dnd-production|my-dnd-test|workbox)-precache-/.test(name) && scopes.some(scope => name.endsWith(scope))
    ).map(name => caches.delete(name)));
  }
}

// Runs alongside the app, only at the two new addresses (not in dev/old PR preview).
if (typeof document !== 'undefined' && /\/my-dnd\/(?:app|test-app)\/$/.test(new URL('./', document.baseURI).pathname)) {
  void retireLegacyApps(new URL('../../', document.baseURI)).catch(() => {
    // Old workers can also retire through their replacement script or the old URL.
    // A cleanup failure must not prevent access to local character data.
  });
}
