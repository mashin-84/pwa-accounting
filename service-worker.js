self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/manifest.json',
                '/icons/icon-192.png',
                '/icons/icon-512.png'
            ]).catch(err => {
                console.error('❌ Cache addAll 失敗', err);
            });
        })
    );
});
