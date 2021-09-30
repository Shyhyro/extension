const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/horses\/(\d{1,10})\/.*/;
const realtoolsDomain = 'https://realtools.shay.cat';
const storage = {};

function initMergeButton() {
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (mergeButton) return;
    const head = document.getElementsByTagName('head')[0];
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = `${realtoolsDomain}/static/extensions.css`;
    head.appendChild(stylesheet);

    const button = document.createElement('button');
    button.classList = 'yellow';
    button.id = 'realtools-merge-button';
    button.title = 'with Realmerge! :)';
    button.form = null;
    button.onclick = () => {mergeImageStorageContainer()};
    const text = document.createTextNode('Merge');
    button.appendChild(text);

    const pane = document.getElementsByClassName('horse_left')[0];
    pane.insertBefore(button, pane.children[1]);
}

async function mergeImageStorageContainer() {
    const data = await browser.storage.sync.get('realtoolsSettings');
    Object.assign(storage, data.realtoolsSettings);
    if (typeof storage.watermark == 'undefined') {
        storage.watermark = true
    }
    storage.taglineFormat = storage.taglineFormat || '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P';
    await mergeImage();
}

async function mergeImage() {
    const url = window.location.href;
    if (!hrUrlRegex.test(url)) return;
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (!mergeButton) return;

    mergeButton.innerText = 'Merging...';
    mergeButton.disabled = 'true';

    // merge the horse
    const response = await fetch(`${realtoolsDomain}/api/merge`, {
        method: 'POST',
        body: JSON.stringify({url: url, return_layer_urls: true, watermark: storage.watermark, use_whites: !storage.remove_whites}),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    // error-from-server handling
    if (!response.ok) {
        alert(`Realmerge error: ${data.message}`);
        return
    }

    // remove the top bar, realtools is more important :sunglasses:
    const looking_at = document.getElementsByClassName('looking_at')[0]
    if (looking_at) looking_at.remove();

    // add our layers (replaces the top bar)
    const layersBox = document.createElement('div');
    layersBox.classList = 'realtools-layers-slider looking_at';
    for (const layerImgUrl of data.layer_urls) {
        const layerImg = document.createElement('img');
        layerImg.src = layerImgUrl;
        layersBox.appendChild(layerImg);
    }
    const horse_banner = document.getElementsByClassName('horse_banner')[0];
    horse_banner.insertBefore(layersBox, horse_banner.children[0]);

    // show the merged horse
    function replaceWithMerged(parent, mergedUrl, foal=false) {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
        const merged = document.createElement('img');
        merged.src = mergedUrl;
        if (foal) {
            merged.classList = 'realtools-merged-result foal';
        } else {
            merged.classList = 'realtools-merged-result';
        }
        parent.appendChild(merged);
    }
    const horse_photos = document.getElementsByClassName('horse_photo');
    if (data.horse_url) {
        replaceWithMerged(horse_photos[0], data.horse_url)
    }
    if (data.foal_url) {
        replaceWithMerged(horse_photos[1], data.foal_url, foal=true)
        document.getElementsByClassName('horse_photocon foal')[0].classList = 'horse_photocon foal realtools-photocon';
    }

    // add a "powered by" pseudo-tab
    const tabnav = document.getElementsByClassName('grid_12 tabnav')[0];
    const tab_a = document.createElement('a');
    tab_a.href = realtoolsDomain + '/merge';
    tab_a.target = '_blank';
    const tab = document.createElement('div');
    tab.classList = 'realtools-powered-tab';
    tab.appendChild(document.createTextNode('Merging Powered by Realmerge'));
    tab_a.appendChild(tab);
    tabnav.appendChild(tab_a);

    // remove the button, you only need to merge once silly
    mergeButton.remove();
}

if (hrUrlRegex.test(window.location.href)) {
    window.addEventListener('load', () => {
        initMergeButton()
    })
}
