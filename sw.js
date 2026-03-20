// Unified service worker for all escape rooms
// Bump CACHE_VERSION on every deploy to trigger auto-update on all installed devices
const CACHE_VERSION = 'v1';
const CACHE_NAME = `escape-rooms-${CACHE_VERSION}`;

const SHELL_URLS = [
  '/escaperoom/',
  '/escaperoom/index.html',
  '/escaperoom/manifest.json',
  '/escaperoom/icons/icon-192.png',
  '/escaperoom/icons/icon-512.png',
];

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
  // Immediately activate — no waiting for old clients to close
  self.skipWaiting();
});

// Activate — delete old caches and take control of all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
//   Navigation requests → network-first (so updated pages always load fresh)
//   Static assets       → cache-first (hashed filenames = safe to cache indefinitely)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/escaperoom/index.html')
          )
        )
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
