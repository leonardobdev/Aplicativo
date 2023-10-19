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
      } else {
        return fetch(e.request);
      }
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