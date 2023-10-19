const PRECACHE = 'precache-v3';
const RUNTIME = 'runtime';

const PRECACHE_URLS = [
  "/Snake/img/x1024.png",
  "/Snake/img/animated_favicon1.gif",
  "/Snake/favicon.ico",
  "/Snake/img/logo.svg",
  "/Snake/sw.js",
  "/Snake/",
  "/Snake/index.html",
  "/Snake/js/materialize.min.js",
  "/Snake/css/materialize.min.css",
  "/Snake/material-icons/iconfont/material-icons.css",
  "/Snake/material-icons/iconfont/material-icons.woff",
  "/Snake/material-icons/iconfont/material-icons.woff2",
  "/Snake/manifest.json",
  "/Snake/app.js"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});