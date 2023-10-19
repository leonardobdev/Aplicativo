var APP_PREFIX = 'snakeServiceworker_';
var VERSION = 'v1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  "/Snake/img/x1024.png",
  "/Snake/img/animated_favicon1.gif",
  "/Snake/favicon.ico",
  "/Snake/img/logo.svg",
  "/Snake/sw.js",
  "/Snake/js/script.js",
  "/Snake/css/style.css",
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

self.addEventListener('fetch', async function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(async function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

    })
  )
});

self.addEventListener('install', async function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
});

self.addEventListener('activate', async function (e) {
  e.waitUntil(
    caches.keys().then(async function (keyList) {

      var cacheWhitelist = keyList.filter(async function (key) {
        return key.indexOf(APP_PREFIX)
      })

      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(async function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
});