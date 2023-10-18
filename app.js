if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/Snake/sw.js', { scope: '/' })
}