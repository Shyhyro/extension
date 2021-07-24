const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/horses\/(\d{1,10})\/.*/

function init() {
    const head = document.getElementsByTagName('head')[0];
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://realmerge.shay.cat/static/extensions.css';
    head.appendChild(stylesheet);

    const button = document.createElement('button');
    button.classList = 'yellow';
    button.id = 'realmerge-merge-button';
    button.title = 'with Realmerge! :)';
    button.onclick = () => {mergeImage()};
    const text = document.createTextNode('Merge');
    button.appendChild(text);

    const pane = document.getElementsByClassName('horse_left')[0];
    pane.insertBefore(button, pane.children[1]);
}
init();

async function mergeImage() {
    const url = window.location.href;
    if (!hrUrlRegex.test(url)) return;
    const mergeButton = document.querySelector('#realmerge-merge-button');
    if (!mergeButton) return;

    mergeButton.innerText = 'Merging...';
    mergeButton.disabled = 'true';

    // merge the horse
    const response = await fetch('https://realmerge.shay.cat/api/merge', {
        method: 'POST',
        body: JSON.stringify({url: url, return_layer_urls: true}),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    // error-from-server handling
    if (!response.ok) {
        alert(`Realmerge error: ${data.message}`);
        return
    }

    // remove the top bar, realmerge is more important :sunglasses:
    const looking_at = document.getElementsByClassName('looking_at')[0]
    if (looking_at) looking_at.remove();

    // add our layers (replaces the top bar)
    const layersBox = document.createElement('div');
    layersBox.classList = 'realmerge-layers-slider looking_at';
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
            merged.classList = 'realmerge-merged-result foal';
        } else {
            merged.classList = 'realmerge-merged-result';
        }
        parent.appendChild(merged);
    }
    const horse_photos = document.getElementsByClassName('horse_photo');
    if (data.horse_url) {
        replaceWithMerged(horse_photos[0], data.horse_url)
    }
    if (data.foal_url) {
        replaceWithMerged(horse_photos[1], data.foal_url, foal=true)
        document.getElementsByClassName('horse_photocon foal')[0].classList = 'horse_photocon foal realmerge-photocon';
    }

    // add a "powered by" pseudo-tab
    const tabnav = document.getElementsByClassName('grid_12 tabnav')[0];
    const tab_a = document.createElement('a');
    tab_a.href = 'https://realmerge.shay.cat';
    tab_a.target = '_blank';
    const tab = document.createElement('div');
    tab.classList = 'realmerge-powered-tab';
    tab.appendChild(document.createTextNode('Merging Powered by Realmerge'));
    tab_a.appendChild(tab);
    tabnav.appendChild(tab_a);

    // remove the button, you only need to merge once silly
    mergeButton.remove();
}
