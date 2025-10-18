const CACHE_NAME = 'antojitos-cache-v1';
const URLS_TO_CACHE = [
  'index.html',
  'css/styles.css',
  'manifest.json',
  'assets/images/placeholder.png',
  'js/data.js','js/main.js','js/mesas.js','js/pedidos.js','js/cocina.js','js/pagos.js','js/admin.js',
  'pages/mesas.html','pages/pedidos.html','pages/cocina.html','pages/pagos.html','pages/admin.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.map(n => n !== CACHE_NAME && caches.delete(n)))));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});