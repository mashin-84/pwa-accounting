const CACHE_NAME = "pwa-cache-v6"; // 每次更新版本強制刷新
const CACHE_FILES = [
    "/pwa-accounting/",
    "/pwa-accounting/index.html",
    "/pwa-accounting/styles.css",
    "/pwa-accounting/script.js",
    "/pwa-accounting/manifest.json",
    "/pwa-accounting/icon/icon-192.png",
    "/pwa-accounting/icon/icon-512.png"
];

// 🛠️ 安裝 Service Worker 並快取資源
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES).catch((err) => {
                console.error("❌ Cache addAll 失敗：可能是某個檔案 404", err);
            });
        })
    );
    self.skipWaiting(); // ✅ 立即啟用新的 Service Worker
});

// 🛠️ 移除舊快取
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) { // ❌ 刪除舊版本快取
                        console.log("🗑️ 刪除舊快取：", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); // ✅ 讓新的 Service Worker 立即生效
});

// 🛠️ 攔截請求，先從快取讀取，若無則從網路請求
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.log("❌ 無法獲取資源", event.request.url);
            });
        })
    );
});

