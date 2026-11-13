/* =====================================================================
   sw.js — Service Worker: guarda los archivos de la app en el teléfono
   para que funcione SIN INTERNET (por ejemplo, en un piso del hospital
   con mala señal).

   Cada vez que cambies algún archivo de la app, sube el número de
   versión para que los teléfonos descarguen la versión nueva.
   ===================================================================== */

const VERSION = 'news2-v1';

const ARCHIVOS = [
  './',
  './index.html',
  './styles.css',
  './news2.js',
  './app.js',
  './manifest.json',
  './iconsicon-192.png',
  './iconsicon-512.png',
  './iconsapple-touch-icon.png',
  './iconslogo.png',
];

// 1. Instalación: descarga y guarda todos los archivos
self.addEventListener('install', evento => {
  evento.waitUntil(caches.open(VERSION).then(cache => cache.addAll(ARCHIVOS)));
  self.skipWaiting();
});

// 2. Activación: borra versiones viejas
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(c => c !== VERSION).map(c => caches.delete(c)))
    )
  );
  self.clients.claim();
});

// 3. Cada petición: primero busca en la caché; si no está, va a internet
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request).then(guardado => guardado || fetch(evento.request))
  );
});
