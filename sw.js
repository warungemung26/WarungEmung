// sw.js
const CACHE_NAME = 'warung-emung-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/logo-warung.png',
  './css/main.css',
  // tambahkan file JS/CSS lain yang dipakai oleh halaman utama
  './js/main.js',
  './js/data-loader.js',
  './js/cart.js'
];

// Install event: simpan resource
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .catch(err => console.error('Cache addAll error:', err))
  );
});

// Activate: hapus cache lama kalau ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fallback ke network
self.addEventListener('fetch', (event) => {
  // hanya tangani GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      if (cachedResp) return cachedResp;
      return fetch(event.request)
        .then(networkResp => {
          // simpan response ke cache (optional, tapi hati-hati space)
          return caches.open(CACHE_NAME).then(cache => {
            try {
              // klon response untuk cache + return ke client
              cache.put(event.request, networkResp.clone());
            } catch (err) {
              // beberapa request cross-origin mungkin tidak bisa di-cache
            }
            return networkResp;
          });
        })
        .catch(() => {
          // fallback: bila request page HTML gagal, kembalikan index.html dari cache (offline fallback)
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
    })
  );
});
