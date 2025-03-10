const CACHE_NAME = "pwa-cache-v2";
const urlsToCache = [
  "/pwa-accounting/",
  "/pwa-accounting/index.html",
  "/pwa-accounting/manifest.json",
  "/pwa-accounting/serviceWorker.js",
  "/pwa-accounting/icon/icon-192.png",
  "/pwa-accounting/icon/icon-512.png"
];

// 安裝 Service Worker 並快取指定檔案
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 啟動時刪除舊快取
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("刪除舊快取:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 讓 PWA 在離線時仍然可以讀取快取內容，並在有網路時更新快取
self.addEventListener("fetch", event => {
  if (event.request.url.includes("script.google.com")) {
    // 不快取 API 請求，直接取用線上版本
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
