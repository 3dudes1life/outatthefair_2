const CACHE = 'oatf-v6.9.1';
const SCOPE = new URL(self.registration.scope);
const CORE_PATHS = [
  '',
  'index.html',
  '404.html',
  'manifest.webmanifest',
  'assets/app.css',
  'assets/app.js',
  'assets/favicon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png',
  'assets/images/oatf-logo-fallback.svg',
  'assets/images/hero-fallback.svg',
  'assets/images/riverside-fallback.svg',
  'assets/images/sandiego-fallback.svg',
  'assets/images/orangecounty-fallback.svg'
];
const CORE = CORE_PATHS.map(path => new URL(path, SCOPE).href);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) ||
            caches.match(new URL('404.html', SCOPE).href);
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request)
          .then(response => {
            if (response && response.ok) {
              caches.open(CACHE).then(cache => cache.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })
    );
  }
});