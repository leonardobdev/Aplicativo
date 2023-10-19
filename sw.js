var APP_PREFIX = "SnakeServiceworker_"
var VERSION = "version_03"
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [
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

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("responding with cache : " + e.request.url)
        return request
      } else {
        console.log("file is not cached, fetching : " + e.request.url)
        return fetch(e.request)
      }
    })
  )
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      });
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log("deleting cache : " + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
});