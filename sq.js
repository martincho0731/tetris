self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("tetris-cache").then((cache) => {
            return cache.addAll([
                "./",
                "./index.html",
                "./styles.css",
                "./tetris.js",
                "./manifest.json",
                "./icons/tetris_icon_192x192.png",
                "./icons/tetris_icon_512x512.png"
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
