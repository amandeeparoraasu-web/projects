const scope = new URL(self.registration.scope);
const prefix = `walletwise:${scope.pathname}:`;
const cacheName = `${prefix}__BUILD_HASH__`;
const assets = [
  './index.html', './styles.css', './app.js', './icons.js', './catalog.js', './rewards.js',
  './storage.js', './market.json', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch.png', './icons/maskable-512.png',
];
const cachedAssets = new Set(assets.map(path => new URL(path, scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(assets.map(path => new Request(new URL(path, scope), { cache: 'reload' })))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(scope.href)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(cacheName);
      return (await cache.match(new URL('./index.html', scope))) ?? fetch(request);
    })());
  } else if (cachedAssets.has(request.url)) {
    event.respondWith((async () => {
      const cache = await caches.open(cacheName);
      return (await cache.match(request)) ?? fetch(request);
    })());
  }
});
