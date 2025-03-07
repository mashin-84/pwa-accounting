const CACHE_NAME = "pwa-cache-v1";
const CACHE_FILES = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/manifest.json",
    "/icon/icon-192.png",
    "/icon/icon-512.png"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES)
                .catch(err => console.error("❌ Cache addAll 失敗", err));
        })
    );
    self.skipWaiting(); // 讓 Service Worker 立即啟動
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(err => console.error("❌ 讀取快取失敗", err))
    );
});


self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("🗑️ 刪除舊快取：", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 讓新的 Service Worker 立即生效
});
