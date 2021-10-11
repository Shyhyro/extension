const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/horses\/(\d{1,10})\/.*/;
const realtoolsDomain = 'https://realtools.shay.cat';
const storage = {};

// https://github.com/discohook/site/blob/main/common/base64/base64Encode.ts
function base64Encode(utf8) {
    const encoded = encodeURIComponent(utf8);

    const escaped = encoded.replace(/%[\dA-F]{2}/g, hex => {
      return String.fromCharCode(Number.parseInt(hex.slice(1), 16));
    });

    return btoa(escaped)
}

// https://github.com/discohook/site/blob/main/common/base64/base64UrlEncode.ts
function base64UrlEncode(utf8) {
    return base64Encode(utf8)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
}

function dissectUrl(url) {
    const split = url.split('/');
    const randomNum = Math.floor((Math.random() * 10000) + 1);
    const layerId = split[8].replace('.png', '');
    return {
        type: split[4],
        horse_type: split[5],
        body_part: split[6],
        size: split[7],
        id: layerId,
        large_url: url,
        small_url: url.replace('large', 'small'),
        enabled: true,
        key_id: `${randomNum}-${layerId}`
    }
}

function generateMultiData(parent_class) {
    const data = {
        id: document.querySelector('#hid').value,
        tld: window.location.hostname.replace('horsereality.', '').replace('v2.', '').replace('www.', ''),
        name: document.title.replace(' - Horse Reality', ''),
        source: 'Horse Reality via Extension',
        layers: []
    };
    let index = 0;
    for (const img of document.querySelector(parent_class).children) {
        if (img.src.indexOf('blank.png') != -1) {
            continue
        }
        const layer = dissectUrl(img.src);
        layer.index = index;
        data.layers.push(layer);
        index += 1;
    }
    return base64UrlEncode(JSON.stringify(data))
}

function initButtons() {
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (mergeButton) return;
    const pane = document.getElementsByClassName('horse_left')[0];

    function createMergeButton() {
        const button = document.createElement('button');
        button.classList = 'yellow';
        button.id = 'realtools-merge-button';
        button.title = 'with Realmerge! :)';
        button.form = null;
        button.onclick = () => {mergeImageStorageContainer()};
        const text = document.createTextNode('Merge');
        button.appendChild(text);

        pane.insertBefore(button, pane.children[1]);
    }
    function createMultiButton(parent_class, name='Multi') {
        const linkWrap = document.createElement('a');
        linkWrap.href = `${realtoolsDomain}/merge/multi?data=${generateMultiData(parent_class)}`;
        linkWrap.target = '_blank';
        
        const button = document.createElement('button');
        button.classList = 'yellow';
        button.id = `realtools-multi-button-${name}`;
        button.form = null;
        const text = document.createTextNode(name);
        button.appendChild(text);
        
        linkWrap.appendChild(button);
        return linkWrap
    }
    function createRealtoolsSection() {
        const div = document.createElement('div');
        div.classList = ['infotext realtools-left-section'];

        const title = document.createElement('h2');
        title.appendChild(document.createTextNode('Realtools'));
        div.appendChild(title);

        const multiButton = createMultiButton('.horse_photocon>.horse_photo');
        div.appendChild(multiButton);

        if (document.querySelector('.foal')) {
            multiButton.children[0].innerText = 'Multi (mare)';
            div.appendChild(document.createTextNode(' '));
            const multiFoalButton = createMultiButton('.horse_photocon.foal>.horse_photo', 'Multi (foal)');
            div.appendChild(multiFoalButton);
        }

        pane.insertBefore(div, pane.children[-1]);
    }
    createMergeButton();
    createRealtoolsSection();
}

async function mergeImageStorageContainer() {
    const data = await browser.storage.sync.get('realtoolsSettings');
    Object.assign(storage, data.realtoolsSettings);
    if (typeof storage.watermark == 'undefined') {
        storage.watermark = true
    }
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
        initButtons();
    })
}
