const storage = {};
const watermarkCheck = document.querySelector('#settings-watermark');
const removeWhitesCheck = document.querySelector('#settings-remove-whites');
const taglineFormat = document.querySelector('#settings-tagline-format');

async function init() {
    const data = await browser.storage.sync.get('realtoolsSettings');
    Object.assign(storage, data.realtoolsSettings);
    if (typeof storage.watermark != 'undefined') {watermarkCheck.checked = Boolean(storage.watermark)}
    else {watermarkCheck.checked = true}
    if (typeof storage.remove_whites != 'undefined') {removeWhitesCheck.checked = Boolean(storage.remove_whites)}
    else {removeWhitesCheck.checked = false}

    storage.taglineFormat = storage.taglineFormat || '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P';
    taglineFormat.value = storage.taglineFormat

    watermarkCheck.addEventListener('click', (event) => {
        storage.watermark = event.target.checked;
        browser.storage.sync.set({realtoolsSettings: storage});
    });
    removeWhitesCheck.addEventListener('click', (event) => {
        storage.remove_whites = event.target.checked;
        browser.storage.sync.set({realtoolsSettings: storage});
    });
    taglineFormat.addEventListener('change', (event) => {
        storage.taglineFormat = event.target.value;
        browser.storage.sync.set({realtoolsSettings: storage});
    });
}

init();
