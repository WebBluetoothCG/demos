const version = "10";

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url)

  event.respondWith(
   caches.open(version).then(cache => {
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
