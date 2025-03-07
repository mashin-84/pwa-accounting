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
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache-v4').then((cache) => { // 🔥 改版快取名稱，強制更新
            return cache.addAll([
                './', // ✅ 確保這裡是相對路徑
                './index.html',
                './styles.css',
                './script.js',
                './manifest.json',
                './icon/icon-192.png',
                './icon/icon-512.png'
            ]).catch(err => {
                console.error('❌ Cache addAll 失敗：可能是某個檔案 `404`', err);
            });
        })
    );
});

// 🆕 修正 activate，確保刪除舊快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== 'pwa-cache-v4') { // 只保留最新的快取
                    console.log("🗑️ 刪除舊快取：", key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 🆕 讓所有請求都從快取讀取（離線可用）
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => console.log("❌ 無法獲取資源", event.request.url))
    );
});
    self.clients.claim(); // 讓新的 Service Worker 立即生效
});
