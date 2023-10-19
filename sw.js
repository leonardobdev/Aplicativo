const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v3');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v3');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  event.waitUntil(async function () {
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    } return;
  })();
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
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
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  );
});