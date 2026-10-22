// Called on the waiting worker before activation. Existing app tabs must finish editing first.
self.addEventListener('message', event => {
  if (event.data?.type !== 'COUNT_APP_TABS' || !event.ports[0]) return;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
    // The two apps have sibling scopes. Count only this registration's windows.
    event.ports[0].postMessage(clients.filter(client => client.url.startsWith(self.registration.scope)).length);
  }));
});
