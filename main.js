if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js')
    .then(() => console.log("Service Worker 註冊成功！"))
    .catch(error => console.log("Service Worker 註冊失敗:", error));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    document.getElementById('installPWA').style.display = 'block';
});

window.installPWA = function() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                console.log('PWA 安裝成功！');
            } else {
                console.log('PWA 安裝取消');
            }
            deferredPrompt = null;
        });
    }
};

// 記帳功能
let apiUrl = "https://script.google.com/macros/s/AKfycbxjcV8ri8A8lpBPgmAlwfhWRwS12VhNCQMGXDHkjqE-GA7XcHy13TCynRxVuHeTvj8b/exec";
let records = JSON.parse(localStorage.getItem("records")) || [];
let categories = { accounts: [], income: [], expense: [] };

function fetchCategoriesFromSheet() {
    fetch(apiUrl + "?action=getCategories")
    .then(response => response.json())
    .then(data => {
        if (data["帳戶清單"] && data["收入類別清單"] && data["支出類別清單"]) {
            categories.accounts = data["帳戶清單"];
            categories.income = data["收入類別清單"];
            categories.expense = data["支出類別清單"];
            localStorage.setItem("categories", JSON.stringify(categories));
            populateAccounts();
            updateCategoryList();
        }
    })
    .catch(error => console.error("類別讀取錯誤:", error));
}

window.updateCategoryList = function() {
    let type = document.getElementById("type").value;
    let categorySelect = document.getElementById("category");
    categorySelect.innerHTML = "";
    let selectedCategories = type === "收入" ? categories.income : categories.expense;
    selectedCategories.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
};

function populateAccounts() {
    let accountSelect = document.getElementById("account");
    accountSelect.innerHTML = "";
    categories.accounts.forEach(account => {
        let option = document.createElement("option");
        option.value = account;
        option.textContent = account;
        accountSelect.appendChild(option);
    });
}

window.confirmUpload = function() {
    if (confirm("確定要上傳資料嗎？")) uploadData();
};

window.confirmDownload = function() {
    if (confirm("確定要下載資料嗎？")) downloadData();
};

function uploadData() {
    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload", records })
    })
    .then(() => alert("資料上傳成功！"))
    .catch(error => alert("上傳失敗: " + error));
}

function downloadData() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        records = data;
        localStorage.setItem("records", JSON.stringify(records));
        alert("資料下載成功！");
    })
    .catch(error => alert("下載失敗: " + error));
}

window.showRecords = function() {
    let list = document.getElementById("recordList");
    list.innerHTML = "";
    records.forEach((record, index) => {
        list.innerHTML += `<div class="record-item">${record.date} - ${record.type} - ${record.account} - ${record.category} - ${record.amount} <button onclick="deleteRecord(${index})">❌</button></div>`;
    });
};

window.deleteRecord = function(index) {
    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    showRecords();
};

window.onload = function() {
    fetchCategoriesFromSheet();
};
