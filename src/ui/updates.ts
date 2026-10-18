/** Explicit PWA updates: preserve IndexedDB and never interrupt an open character form. */
export function installUpdates() {
  const banner = document.createElement('aside');
  banner.id = 'app-update'; banner.hidden = true; banner.setAttribute('aria-label', 'Appoppdatering');
  const text = document.createElement('p'); text.setAttribute('role', 'status');
  const apply = document.createElement('button'); apply.textContent = 'Oppdater appen'; apply.hidden = true;
  const close = document.createElement('button'); close.textContent = 'Lukk'; close.onclick = () => { banner.hidden = true; };
  banner.append(text, apply, close); document.body.append(banner);
  let registration: ServiceWorkerRegistration | undefined;
  let checking = false, activating = false, reloadRequested = false, manualCheck = false;
  let hasController = 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);
  const show = (message: string) => { text.textContent = message; banner.hidden = false; };
  const ready = () => {
    if (!registration?.waiting || !registration.active) return;
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
  const registered = supported ? navigator.serviceWorker.register(new URL('./sw.js', document.baseURI), { updateViaCache: 'none' })
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
      if (registration?.waiting) { ready(); return; }
      if (!navigator.onLine) { if (manualCheck) show('Du er uten nett. Lagrede karakterer kan fortsatt brukes; prøv igjen når du er på nett.'); return; }
      if (manualCheck) show('Ser etter en ny versjon …');
      // Retry registration if its first attempt failed; no storage is removed.
      if (!registration) {
        registration = await navigator.serviceWorker.register(new URL('./sw.js', document.baseURI), { updateViaCache: 'none' });
        registration.addEventListener('updatefound', () => watch(registration!.installing));
        watch(registration.installing);
      }
      await registration.update();
      if (registration.waiting) ready();
      else if (manualCheck) show(registration.installing ? 'Laster ned en ny versjon …' : `Ingen nyere versjon funnet. Du bruker versjon ${__APP_VERSION__}.`);
    } catch {
      if (manualCheck) show('Kunne ikke sjekke oppdateringer. Karakterdata er beholdt. Kontroller forbindelsen og prøv igjen.');
    } finally { checking = false; }
  }
  function countTabs(worker: ServiceWorker): Promise<number> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = window.setTimeout(() => { channel.port1.close(); reject(new Error('Kunne ikke kontrollere åpne appfaner. Lukk de andre appfanene og prøv igjen.')); }, 3000);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        if (Number.isInteger(event.data) && event.data >= 1) resolve(event.data);
        else reject(new Error('Kunne ikke kontrollere åpne appfaner. Prøv igjen.'));
      };
      worker.postMessage({ type: 'COUNT_APP_TABS' }, [channel.port2]);
    });
  }
  apply.onclick = async () => {
    if (activating) return;
    if (document.querySelector('dialog[open]')) { show('Lagre eller avbryt den åpne dialogen før du oppdaterer.'); return; }
    const worker = registration?.waiting;
    if (!worker) { apply.hidden = true; await check(); return; }
    activating = true; apply.disabled = true;
    try {
      if (await countTabs(worker) > 1) {
        show('Appen er åpen i flere faner eller vinduer. Lagre endringer og lukk de andre, og trykk Oppdater appen her igjen.');
        return;
      }
      reloadRequested = true;
      show('Oppdaterer appen. Karakterene dine beholdes …');
      worker.postMessage({ type: 'SKIP_WAITING' });
    } catch (error) { show(error instanceof Error ? error.message : 'Oppdatering mislyktes. Prøv igjen.'); }
    finally { if (!reloadRequested) { activating = false; apply.disabled = false; } }
  };
  if (supported) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hasController) { hasController = true; return; }
      if (reloadRequested && !document.querySelector('dialog[open]')) window.location.reload();
      else if (registration?.active) {
        apply.hidden = true;
        show('En ny versjon er aktiv. Lagre eller avbryt redigering og last siden på nytt når du er klar.');
      }
    });
    window.addEventListener('focus', () => { void check(false); });
    window.addEventListener('online', () => { void check(false); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void check(false); });
  }
  return { check: () => check(true) };
}
