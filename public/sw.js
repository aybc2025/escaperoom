const CACHE_NAME = 'star7-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.mode === 'navigate') {
    // Network-first for HTML
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
  } else {
    // Cache-first for assets
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
