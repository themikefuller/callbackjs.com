'use strict';

//////////////////// v0.0.0+

importScripts('https://cdn.jsdelivr.net/npm/@starbase/starbase@latest');

const starbase = Starbase();

const cacheName = 'app';
const resources = [
  '/', '/404.html', '/offline', '/manifest.json', '/styles.css', '/app.js',
  'https://cdn.jsdelivr.net/npm/@starbase/starbase@latest',
  '/images/icon-96.png', '/images/icon-120.png', '/images/icon-192.png', '/images/icon-384.png', '/images/icon-512.png',
];

self.addEventListener('install', async (e) => {
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
        return cache.match('/offline');
      });
    }
  })());

});
