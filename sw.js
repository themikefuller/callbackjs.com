'use strict';

/////////////////////// v0.0.0+

importScripts('https://cdn.jsdelivr.net/npm/@starbase/starbase@latest');

const starbase = Starbase();

const cacheName = 'app';
const resources = [
  '/', '/404', '/offline', '/manifest.json', '/styles.css', '/app.js',
  'https://cdn.jsdelivr.net/npm/@starbase/starbase@latest',
  '/images/icon-96.png', '/images/icon-120.png', '/images/icon-192.png', '/images/icon-384.png', '/images/icon-512.png',
];

const pwa = starbase.PWA().sw(resources, '/offline', cacheName);
