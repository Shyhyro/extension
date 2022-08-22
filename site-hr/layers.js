function showLayers() {
    if (document.getElementById('realtools-layer-ids-box')) return

    const adultIds = [];
    const adultWhiteIds = [];
    const foalIds = [];
    const foalWhiteIds = [];
    const containers = document.getElementsByClassName('horse_photo');
    for (const container of containers) {
        for (const img of container.children) {
            const match = img.src.match(layerRegex);
            if (match) {
                if (img.className.indexOf('foal') != -1) {
                    if (img.src.indexOf('whites') != -1) {
                        foalWhiteIds.push({part: match[3], id: match[4]});
                    } else {
                        foalIds.push({part: match[3], id: match[4]});
                    }
                } else {
                    if (img.src.indexOf('whites') != -1) {
                        adultWhiteIds.push({part: match[3], id: match[4]});
                    } else {
                        adultIds.push({part: match[3], id: match[4]});
                    }
                }
            }
        }
    }
    const addTopPadding = !!document.querySelector('.looking_at');
    const layerIdsBox = document.createElement('div');
    layerIdsBox.id = 'realtools-layer-ids-box';
    layerIdsBox.classList = ['looking_at'];
    if (addTopPadding) layerIdsBox.style.top = '65px';
    layerIdsBox.style.right = '20px';
    layerIdsBox.style.width = 'auto';
    layerIdsBox.style.textAlign = 'left';

    if (adultIds.length > 0) {
        const layerIdsTitle = document.createElement('h1');
        layerIdsTitle.style.fontSize = '18px';
        layerIdsTitle.style.margin = '0 25px 0px 25px';
        layerIdsTitle.style.userSelect = 'none';
        layerIdsTitle.appendChild(document.createTextNode('Adult Layers'));
        layerIdsBox.appendChild(layerIdsTitle);
    }

    for (const layer of adultIds) {
        const layerIdLine = document.createElement('p');
        let text = '';
        text = text + `<span class="realtools-noselect"><b>${layer.part}:</b> </span><code>${layer.id}</code><br>`;
        layerIdLine.innerHTML = text;
        layerIdsBox.appendChild(layerIdLine);
    }
    for (const layer of adultWhiteIds) {
        const layerIdLine = document.createElement('p');
        let text = '';
        text = text + `<span class="realtools-noselect"><b>${layer.part} (whites):</b> </span><code>${layer.id}</code><br>`;
        layerIdLine.innerHTML = text;
        layerIdsBox.appendChild(layerIdLine);
    }

    if (foalIds.length > 0) {
        const layerIdsTitleFoal = document.createElement('h1');
        layerIdsTitleFoal.style.fontSize = '18px';
        layerIdsTitleFoal.style.margin = '0 25px 0px 25px';
        layerIdsTitleFoal.style.userSelect = 'none';
        layerIdsTitleFoal.appendChild(document.createTextNode('Foal Layers'));
        layerIdsBox.appendChild(layerIdsTitleFoal);
    }

    for (const layer of foalIds) {
        const layerIdLine = document.createElement('p');
        let text = '';
        text = text + `<span class="realtools-noselect"><b>${layer.part}:</b> </span><code>${layer.id}</code><br>`;
        layerIdLine.innerHTML = text;
        layerIdsBox.appendChild(layerIdLine);
    }
    for (const layer of foalWhiteIds) {
        const layerIdLine = document.createElement('p');
        let text = '';
        text = text + `<span class="realtools-noselect"><b>${layer.part} (whites):</b> </span><code>${layer.id}</code><br>`;
        layerIdLine.innerHTML = text;
        layerIdsBox.appendChild(layerIdLine);
    }

    const parent = document.getElementsByClassName('horse_banner')[0];
    parent.appendChild(layerIdsBox)
}


loadStorage().then(() => {
    if (typeof storage.enable_id_display === 'undefined') storage.enable_id_display = false
    else if (storage.enable_id_display) showLayers()
})
