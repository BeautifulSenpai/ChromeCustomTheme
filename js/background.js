chrome.runtime.onInstalled.addListener(() => {
    console.log("Custom New Tab Image Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateBackground') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateBackground' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }
});

chrome.runtime.onSuspend.addListener(() => {
    chrome.storage.local.remove('newTabImage', () => {
        if (chrome.runtime.lastError) {
            console.error('Error clearing data:', chrome.runtime.lastError.message);
        } else {
            console.log('All data has been cleared.');
        }
    });
});