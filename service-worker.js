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
        caches.open('pwa-cache-v3').then((cache) => { // 🔥 改版快取名稱
            return cache.addAll([
                './', // ✅ 這裡用 `./` 確保是相對路徑
                './index.html',
                './styles.css',
                './script.js',
                './manifest.json',
                './icon/icon-192.png',
                './icon/icon-512.png'
            ]).catch(err => {
                console.error('❌ Cache addAll 失敗', err);
            });
        })
    );
});

// 🆕 強制刪除舊快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== 'pwa-cache-v3') { // 只保留最新的快取
                    console.log("🗑️ 刪除舊快取：", key);
                    return caches.delete(key);
                }
            }));
        })
    );
});
    self.clients.claim(); // 讓新的 Service Worker 立即生效
});
