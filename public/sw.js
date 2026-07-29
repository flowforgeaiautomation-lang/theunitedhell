// Cleanup service worker: unregisters itself and clears all old caches
// left behind by the previous Monetag service worker so browsers stop
// serving stale asset bundles (which caused "Failed to fetch dynamically
// imported module" errors after new deployments).

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
