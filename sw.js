'use strict';

////////////// v0.0.0+

const cacheName = 'resources';
const resources = [
  '/', '404.html', '/offline.html',
  '/manifest.json', '/icon-96.png', '/icon-120.png', '/icon-180.png', '/icon-192.png', '/icon-384.png', '/icon-512.png',
  '/styles.css', '/app.js',
];

self.addEventListener('install', async (e) => {
console.log(resources);
  console.log("Installing Service Worker...");
  await caches.delete(cacheName);
  let cache = await caches.open(cacheName);
  await cache.addAll(resources);
  return self.skipWaiting();
});

self.addEventListener('activate', async (e) => {
  console.log('Service Worker Activated!');
});

const fetchNew = async (request) => {
  return fetch(request).then(async response => {
    if (response.status === 200) {
      let cache = await caches.open(cacheName);
      let cached = await cache.match(request);
      if (cached && response.headers.get('eTag') !== cached.headers.get('eTag')) {
        await cache.put(request, response.clone());
        let allClients = await clients.matchAll();
        for (let client of allClients) {
          client.postMessage({
            "msg": "refresh",
            "url": request.url
          });
        }
        return;
      }
    }
  }).catch(err => {
    return;
  });
};

self.addEventListener('fetch', async (e) => {
  if (e.request.method !== 'GET') {
    return;
  }
  e.respondWith((async () => {
    let cache = await caches.open(cacheName);
    let cached = await cache.match(e.request, {
      "ignoreSearch": true
    });
    if (cached) {
      e.waitUntil(fetchNew(e.request));
      return cached;
    } else {
      return fetch(e.request).then(async response => {
        if (response.status === 200) {
          await cache.put(e.request, response.clone());
        }
        return response;
      }).catch(err => {
        return cache.match('/offline.html');
      });
    }
  })());

});
