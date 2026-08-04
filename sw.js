// Network-first service worker for Intake Log.
// Always tries the network so a freshly-deployed version shows up on the next
// launch; falls back to the cached copy only when offline. This is what stops
// the "Add to Home Screen" app freezing on an old build.
const CACHE = 'intake-log-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
