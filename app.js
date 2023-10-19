window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/Snake/sw.js", { scope: "/Snake/" }).then(() => {
      console.log('Service worker registered!');
    }).catch((error) => {
      console.warn('Error registering service worker:');
      console.warn(error);
    });
  }
});