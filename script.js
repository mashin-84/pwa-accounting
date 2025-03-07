console.log("✅ script.js 已載入");

// ✅ 確保 `deferredPrompt` 不會重複宣告
window.deferredPrompt = window.deferredPrompt || null;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.deferredPrompt = event;
    let installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('✅ 使用者接受 PWA 安裝');
                    } else {
                        console.log('❌ 使用者拒絕 PWA 安裝');
                    }
                    window.deferredPrompt = null;
                });
            }
        });
    }
});

// ✅ 確保 Service Worker 正確註冊
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("✅ Service Worker 已註冊"))
        .catch(error => console.error("❌ Service Worker 註冊失敗", error));
}

// ✅ 開啟 Google Apps Script Web App 頁面
function openPage(page) {
    let baseUrl = "https://script.google.com/a/macros/slsh.ntpc.edu.tw/s/AKfycby4dt5yEttAXVUmJgGHrjpfVS9Eie-0NImQDqdqEB8tBQSkaOA8wCNcU4bjBUwcPvP7/exec"; // 替換成你的 Web App URL
    let fullUrl = baseUrl + "?page=" + page;
    window.location.href = fullUrl; // ✅ 改用 `window.location.href`，確保打開新頁面
}
