self.addEventListener('fetch', function(event) {
  const request = event.request;

  event.respondWith(
   caches.open('playbulb-candle').then(cache => {
      return cache.match(request).then(response => {
        var fetchPromise = fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
        // We need to ensure that the event doesn't complete until we
        // know we have fetched the data
        event.waitUntil(fetchPromise);

        // Return the response from cache or wait for network.
        return response || fetchPromise;
      })
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
