// Guarda la animación para que funcione sin conexión después de la primera visita.
// Los archivos de data/ están cifrados: sin la clave del enlace no se pueden ver.
const CACHE = 'copa-dogitec-v3';
const DATA = Array.from({ length:30 }, (_, i) => 'data/d' + String(i).padStart(2,'0') + '.bin');
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', ...DATA];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.endsWith('d30.bin')) return;
  // la página, siempre de la red primero para recibir las actualizaciones
  if (e.request.mode === 'navigate'){ e.respondWith(fetch(e.request).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
