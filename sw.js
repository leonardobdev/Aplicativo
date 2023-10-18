var APP_PREFIX = 'SnakeServiceworker_';
var VERSION = 'v1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/img/x1024.png',
  '/img/x512.png',
  '/img/x384.png',
  '/img/x192.png',
  '/img/x128.png',
  '/img/x96.png',
  '/img/x72.png',
  '/img/x48.png',
  '/img/animated_favicon1.gif',
  '/favicon.ico',
  '/img/logo.svg',
  '/sw.js',
  '/',
  '/index.html',
  '/material-icons/iconfont/material-icons.css',
  '/material-icons/iconfont/material-icons.woff',
  '/material-icons/iconfont/material-icons.woff2',
  '/css/materialize.min.css',
  '/js/materialize.min.js',
  '/manifest.json',
  '/CNAME',
  '/READEME.md',
  '/robots.txt',
  '/app.js'
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