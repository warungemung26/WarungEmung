// ================= AUTO-VERSION CACHE =================
const CACHE_NAME = 'warung-cache-' + new Date().toISOString().replace(/[-:.TZ]/g,'');
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/header.css',
  '/css/hero.css',
  '/css/search.css',
  '/css/grid-produk.css',
  '/css/navigasi.css',
  '/css/popup-reg.css',
  '/css/modal-cart.css',
  '/css/cat-modal.css',
  '/css/qty-addcart.css',
  '/css/notif-cart.css',
  '/css/toast.css',
  '/css/text-scrol.css',
  '/css/all.min.css',
  '/js/data-loader.js',
  '/js/main.js',
  '/js/search.js',
  '/js/cat-modal.js',
  '/js/cart.js',
  '/js/toast-audio.js',
  '/js/register.js',
  '/js/pwa.js'
];

// Install: cache semua file
self.addEventListener('install', evt => {
  console.log('[SW] Install & caching files...');
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', evt => {
  console.log('[SW] Activate & clean old caches...');
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fallback ke network
self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request))
  );
});
