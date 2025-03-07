self.addEventListener("install", function(event) {
    console.log("Service Worker 安裝完成");
    event.waitUntil(
        caches.open("pwa-budget-app").then(function(cache) {
            return cache.addAll(["/", "/index.html", "/styles.css"]);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
