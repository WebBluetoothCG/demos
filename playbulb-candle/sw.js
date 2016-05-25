// Version 7

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('playbulb-candle').then(function(cache) {
      return cache.addAll([
        '/demos/playbulb-candle/',
        '/demos/playbulb-candle/index.html',
        '/demos/playbulb-candle/styles.css',
        '/demos/playbulb-candle/playbulbCandle.js',
        '/demos/playbulb-candle/app.js',
        '/demos/playbulb-candle/color-wheel.png',
        '/demos/playbulb-candle/code.getmdl.io/1.0.4/material.green-light_green.min.css',
        '/demos/playbulb-candle/code.getmdl.io/1.0.4/material.min.js',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      ]).then(function() {
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
