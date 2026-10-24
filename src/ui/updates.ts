import {countAppTabs} from './update-client-check';
/** Explicit PWA updates: preserve IndexedDB and never interrupt an open character form. */
export function installUpdates() {
  const banner = document.createElement('aside');
  banner.id = 'app-update'; banner.hidden = true; banner.setAttribute('aria-label', 'Appoppdatering');
  const text = document.createElement('p'); text.setAttribute('role', 'status');
  const apply = document.createElement('button'); apply.textContent = 'Oppdater appen'; apply.hidden = true;
  const close = document.createElement('button'); close.textContent = 'Lukk'; close.onclick = () => { banner.hidden = true; dismissedWorker = registration?.waiting ?? undefined; };
  banner.append(text, apply, close); document.body.append(banner);
  let registration: ServiceWorkerRegistration | undefined;
  let dismissedWorker: ServiceWorker | undefined;
  let checking = false, activating = false, reloadRequested = false, manualCheck = false;
  const workerUrl = new URL('./sw.js', document.baseURI).href;
  // A first visit can be controlled by a legacy parent worker during migration.
  // Handover to this scope is installation, not an app update.
  let hasController = 'serviceWorker' in navigator && navigator.serviceWorker.controller?.scriptURL === workerUrl;
  const show = (message: string) => { text.textContent = message; banner.hidden = false; };
  const ready = (force=false) => {
    if (!registration?.waiting || !registration.active || (!force && registration.waiting===dismissedWorker)) return;
    apply.hidden = false; apply.disabled = false;
    show('En ny versjon er klar. Lagre eller avbryt eventuell redigering, og trykk Oppdater appen. Karakterene dine beholdes.');
  };
  const watch = (worker: ServiceWorker | null) => {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (registration?.waiting) ready();
      }
    });
  };
  const supported = 'serviceWorker' in navigator && import.meta.env.PROD;
  const registered = supported ? navigator.serviceWorker.register(workerUrl, { updateViaCache: 'none' })
    .then(reg => {
      registration = reg;
      reg.addEventListener('updatefound', () => watch(reg.installing));
      watch(reg.installing);
      if (reg.waiting) ready();
      return reg;
    }).catch(() => {
      show('Kunne ikke klargjøre offline-cache. Karakterdata er beholdt. Prøv Se etter oppdatering når du er på nett.');
      return undefined;
    }) : Promise.resolve(undefined);

  async function check(manual = true) {
    if (!supported) { if (manual) show('Appoppdateringer er tilgjengelige i den publiserte appen.'); return; }
    if (activating) return;
    if (checking) { if (manual) manualCheck = true; return; }
    checking = true; manualCheck = manual;
    try {
      await registered;
      if (registration?.waiting) { ready(manualCheck); return; }
      if (!navigator.onLine) { if (manualCheck) show('Du er uten nett. Lagrede karakterer kan fortsatt brukes; prøv igjen når du er på nett.'); return; }
      if (manualCheck) show('Ser etter en ny versjon …');
      // Retry registration if its first attempt failed; no storage is removed.
      if (!registration) {
        registration = await navigator.serviceWorker.register(workerUrl, { updateViaCache: 'none' });
        registration.addEventListener('updatefound', () => watch(registration!.installing));
        watch(registration.installing);
      }
      await registration.update();
      if (registration.waiting) ready(manualCheck);
      else if (manualCheck) show(registration.installing ? 'Laster ned en ny versjon …' : `Ingen nyere versjon funnet. Du bruker versjon ${__APP_VERSION__}.`);
    } catch {
      if (manualCheck) show('Kunne ikke sjekke oppdateringer. Karakterdata er beholdt. Kontroller forbindelsen og prøv igjen.');
    } finally { checking = false; }
  }
  apply.onclick = async () => {
    if (activating) return;
    if (document.querySelector('dialog[open]')) { show('Lagre eller avbryt den åpne dialogen før du oppdaterer.'); return; }
    const worker = registration?.waiting;
    if (!worker) { apply.hidden = true; await check(); return; }
    activating = true; apply.disabled = true;
    try {
      if (await countAppTabs(registration!) > 1) {
        show('Appen er åpen i flere faner eller vinduer. Lagre endringer og lukk de andre, og trykk Oppdater appen her igjen.');
        return;
      }
      if(document.querySelector('dialog[open]')){show('Lagre eller avbryt den åpne dialogen før du oppdaterer.');return;}
      reloadRequested = true;
      show('Oppdaterer appen. Karakterene dine beholdes …');
      worker.postMessage({ type: 'SKIP_WAITING' });
    } catch (error) { show(error instanceof Error ? error.message : 'Oppdatering mislyktes. Prøv igjen.'); }
    finally { if (!reloadRequested) { activating = false; apply.disabled = false; } }
  };
  if (supported) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (navigator.serviceWorker.controller?.scriptURL !== workerUrl) return;
      if (!hasController && !reloadRequested) { hasController = true; return; }
      hasController = true;
      if (reloadRequested && !document.querySelector('dialog[open]')) window.location.reload();
      else if (registration?.active) {
        apply.hidden = true;
        show('En ny versjon er aktiv. Lagre eller avbryt redigering og last siden på nytt når du er klar.');
      }
    });
    // An app left open at the table must also discover a newly published release.
    window.setInterval(() => { if (!document.hidden && navigator.onLine) void check(false); }, 60_000);
    window.addEventListener('pageshow', () => { void check(false); });
    window.addEventListener('focus', () => { void check(false); });
    window.addEventListener('online', () => { void check(false); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void check(false); });
  }
  return { check: () => check(true) };
}
