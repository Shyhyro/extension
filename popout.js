const storage = {}
const watermarkCheck = document.querySelector('#settings-watermark');

chrome.storage.sync.get('realmergeSettings', (data) => {
    Object.assign(storage, data.realmergeSettings);
    if (typeof storage.watermark != 'undefined') {
        watermarkCheck.checked = Boolean(storage.watermark)
    } else {
        watermarkCheck.checked = true
    }
})

watermarkCheck.addEventListener('click', (event) => {
    storage.watermark = event.target.checked;
    chrome.storage.sync.set({realmergeSettings: storage});
})
