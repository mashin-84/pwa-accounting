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

// ✅ IndexedDB 本地資料庫初始化
let db;
const request = indexedDB.open("PWA-Accounting", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("✅ IndexedDB 已初始化");
};

request.onerror = (event) => {
    console.error("❌ IndexedDB 初始化失敗", event);
};

// ✅ 記錄交易到 IndexedDB
function saveTransaction(transaction) {
    const transactionDB = db.transaction(["transactions"], "readwrite");
    const store = transactionDB.objectStore("transactions");
    store.add(transaction);
    console.log("✅ 已儲存交易紀錄", transaction);
}

// ✅ 取得所有交易紀錄
function getTransactions(callback) {
    const transactionDB = db.transaction(["transactions"], "readonly");
    const store = transactionDB.objectStore("transactions");
    const request = store.getAll();
    request.onsuccess = () => {
        callback(request.result);
    };
}

// ✅ 儲存新類別
function saveCategory(category) {
    const categoryDB = db.transaction(["categories"], "readwrite");
    const store = categoryDB.objectStore("categories");
    store.add(category);
    console.log("✅ 已儲存類別", category);
}

// ✅ 取得所有類別
function getCategories(callback) {
    const categoryDB = db.transaction(["categories"], "readonly");
    const store = categoryDB.objectStore("categories");
    const request = store.getAll();
    request.onsuccess = () => {
        callback(request.result);
    };
}

// ✅ 開啟 Google Apps Script Web App 頁面
function openPage(page) {
    let baseUrl = "https://script.google.com/a/macros/slsh.ntpc.edu.tw/s/AKfycby4dt5yEttAXVUmJgGHrjpfVS9Eie-0NImQDqdqEB8tBQSkaOA8wCNcU4bjBUwcPvP7/exec";
    let fullUrl = baseUrl + "?page=" + page;
    window.location.href = fullUrl; 
}
