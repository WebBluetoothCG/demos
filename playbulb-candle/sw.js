function addToCache(request, networkResponse) {
  return caches.open('playbulb-candle')
    .then(cache => cache.put(request, networkResponse.clone()));
}

function getCacheResponse(request) {
  return caches.open('playbulb-candle').then(cache => {
    return cache.match(request);
  });
}

function getNetworkOrCacheResponse(request) {
  return fetch(request).then(networkResponse => {
    addToCache(request, networkResponse);
    return networkResponse;
  }).catch(_ => {
    return getCacheResponse(request)
      .then(cacheResponse => cacheResponse || Response.error());
  });
}

self.addEventListener('fetch', event => {
  event.respondWith(getNetworkOrCacheResponse(event.request));
});

function cleanOldCache() {
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.filter(cacheName => (cacheName !== 'playbulb-candle'))
                .map(cacheName => caches.delete(cacheName))
    );
  })
}

self.addEventListener('activate', event => {
  event.waitUntil(cleanOldCache());
});
