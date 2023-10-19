var APP_PREFIX = "snakeServiceworker_";
var VERSION = "v1";
var REPOSITORY = "Snake";
var CACHE_NAME = `${APP_PREFIX}${VERSION}`;
var URLS = [
  `/${REPOSITORY}/img/x1024.png`,
  `/${REPOSITORY}/img/animated_favicon1.gif`,
  `/${REPOSITORY}/favicon.ico`,
  `/${REPOSITORY}/img/logo.svg`,
  `/${REPOSITORY}/sw.js`,
  `/${REPOSITORY}/js/script.js`,
  `/${REPOSITORY}/css/style.css`,
  `/${REPOSITORY}/`,
  `/${REPOSITORY}/index.html`,
  `/${REPOSITORY}/js/materialize.min.js`,
  `/${REPOSITORY}/css/materialize.min.css`,
  `/${REPOSITORY}/material-icons/iconfont/material-icons.css`,
  `/${REPOSITORY}/material-icons/iconfont/material-icons.woff`,
  `/${REPOSITORY}/material-icons/iconfont/material-icons.woff2`,
  `/${REPOSITORY}/manifest.json`,
  `/${REPOSITORY}/app.js`
];

self.onfetch = async (e) => {
  e.respondWith(
    caches.match(e.request).then(async (request) => {
      if (request) {
        return request;
      }
      return fetch(e.request);
    })
  );
};

self.oninstall = async (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      return cache.addAll(URLS);
    })
  );
};

self.onactivate = async (e) => {
  e.waitUntil(
    caches.keys().then(async (keyList) => {
      var cacheWhitelist = keyList.filter(async function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(async (key, i) => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
};



/*

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

// Enable navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/app.js",
      "/image-list.js",
      "/star-wars-logo.jpg",
      "/gallery/bountyHunters.jpg",
      "/gallery/myLittleVader.jpg",
      "/gallery/snowTroopers.jpg",
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "/gallery/myLittleVader.jpg",
    }),
  );
});

*/