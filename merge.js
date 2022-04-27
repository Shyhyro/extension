const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.com\/horses\/(\d{1,10})\/.*/;
const realtoolsDomain = 'https://realtools.shay.cat';
const realtoolsAPI = 'https://rt-api.shay.cat/v2';
const storage = {};

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

function initButtons() {
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (mergeButton) return;

    function createMergeLink() {
        const a = document.createElement('a')
        a.id = 'realtools-merge-button'
        a.href = 'javascript:void(0)'
        a.onclick = mergeImageStorageContainer
        a.innerText = 'Merge'
        a.title = 'with Realmerge! :)'
        return a
    }

    function createMultiLink(name='Multi', useFoal=false) {
        const a = document.createElement('a')
        a.id = `realtools-multi-button-${name}`
        a.href = `${realtoolsDomain}/merge/multi?start=${document.querySelector('#hid').value}`
        if (useFoal) {
            a.href += '&foal=true'
        }
        a.target = '_blank'
        a.innerText = name
        return a
    }

    function createVisionLink() {
        const a = document.createElement('a')
        a.id = 'realtools-vision-button'
        a.href = `${realtoolsDomain}/vision?share=${document.querySelector('#hid').value}`
        a.target = '_blank'
        a.innerText = 'Vision'
        return a
    }

    function createRealtoolsSection() {
        const div = document.querySelector('.infotext')

        let lastCell = document.querySelectorAll('.infotext .right')
        lastCell = lastCell[lastCell.length - 1]
        if (!lastCell.innerText) lastCell.innerText = '\u200b'

        const left = document.createElement('div')
        left.classList = 'left'
        left.appendChild(document.createTextNode('Realtools'))

        const right = document.createElement('div')
        right.classList = 'right'

        right.appendChild(createMergeLink())
        right.appendChild(document.createTextNode(', '))

        const hasFoal = !!document.querySelector('.horse_photocon.foal')
        let n = 'Multi'
        if (hasFoal) n = 'Multi (mare)'
        const multiLink = createMultiLink(n)
        right.appendChild(multiLink)

        if (hasFoal) {
            right.appendChild(document.createTextNode(', '))
            right.appendChild(createMultiLink('Multi (foal)', true))
        }

        if (document.querySelector('.foal')) {
            right.appendChild(document.createTextNode(', '))
            right.appendChild(createVisionLink())
        }

        div.appendChild(left)
        div.appendChild(right)
    }
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
    const pageUrl = window.location.href;
    if (!hrUrlRegex.test(pageUrl)) return;
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (!mergeButton) return;

    mergeButton.innerText = 'Merging...'
    mergeButton.removeAttribute('href')
    mergeButton.onclick = null

    adultUrls = [];
    foalUrls = [];

    for (const horse_photo of document.getElementsByClassName('horse_photo')) {
        for (const img of horse_photo.children) {
            if (img.src.indexOf('whites') != -1 && storage.remove_whites) continue

            if (img.classList.contains('foal')) {
                foalUrls.push(img.src)
            } else if (img.src.indexOf('blank.png') == -1) {
                adultUrls.push(img.src)
            }
        }
    }

    let mergedAdultUrl = null;
    let mergedFoalUrl = null;

    // merge the horse(s)
    if (adultUrls.length > 0) {
        const response = await fetch(`${realtoolsAPI}/merge/multiple`, {
            method: 'POST',
            body: JSON.stringify({urls: adultUrls, use_watermark: storage.watermark}),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        // error-from-server handling
        if (!response.ok) {
            alert(`Realmerge error: ${data.message}`);
            return
        }
        mergedAdultUrl = data.merged;
    }
    if (foalUrls.length > 0) {
        const response = await fetch(`${realtoolsAPI}/merge/multiple`, {
            method: 'POST',
            body: JSON.stringify({urls: foalUrls, use_watermark: storage.watermark}),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        // error-from-server handling
        if (!response.ok) {
            alert(`Realmerge error: ${data.message}`);
            return
        }
        mergedFoalUrl = data.merged;
    }

    // remove the top bar
    const looking_at = document.getElementsByClassName('looking_at')[0];
    if (looking_at) looking_at.remove();

    // move the layer ID display so that it does not collide, if present
    const id_display = document.querySelector('#realtools-layer-ids-box');
    if (id_display) id_display.style.top = '130px';

    // add our layers (replaces the top bar)
    const layersBox = document.createElement('div');
    layersBox.classList = 'realtools-layers-slider looking_at';
    for (const layerImgUrl of [...adultUrls, ...foalUrls]) {
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
    if (mergedAdultUrl) {
        replaceWithMerged(horse_photos[0], mergedAdultUrl)
    }
    if (mergedFoalUrl) {
        if (mergedAdultUrl) {
            replaceWithMerged(horse_photos[1], mergedFoalUrl, foal=true)
            document.querySelector('.horse_photocon.foal').classList = 'horse_photocon foal realtools-photocon';
        } else {
            // there is no adult on the page
            replaceWithMerged(horse_photos[0], mergedFoalUrl, foal=true)
            document.querySelector('.horse_photocon').classList = 'horse_photocon foal realtools-photocon';
        }
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

    mergeButton.innerText = 'Merged'
}

if (hrUrlRegex.test(window.location.href)) {
    window.addEventListener('load', () => {
        initButtons();
    })
}
