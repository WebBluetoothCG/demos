self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('playbulb-candle').then(cache => {
      return cache.match(event.request).then(response => {

        // If a request doesn't match anything in the cache, get it from the
        // network, send it to the page & add it to the cache at the same time.
        return response || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

/* Clean up old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => (cacheName !== 'playbulb-candle'))
                  .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});
