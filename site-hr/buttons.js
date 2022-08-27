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


function showButtons() {
    const mergeButton = document.querySelector('#realtools-merge-button');
    if (mergeButton) return;

    function createMergeLink() {
        const a = document.createElement('a')
        a.id = 'realtools-merge-button'
        a.href = 'javascript:void(0)'
        a.onclick = () => {mergeImageStorageContainer(a)}
        a.innerText = 'Merge'
        a.title = 'with Realmerge! :)'
        return a
    }

    function createMultiLink(name='Multi', useFoal=false) {
        const a = document.createElement('a')
        a.id = `realtools-multi-button-${name}`
        a.href = `${realtoolsDomain}/merge/multi?start=${horse.lifenumber}`
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
        if (!horse.looking_at_foal && document.querySelector('.horse_photocon.foal')) {
            const foalUrl = new URL(document.querySelector('.horse_photocon.foal').parentElement.href)
            foalUrl.searchParams.set('predict', '1')
            a.href = foalUrl
        } else {
            a.href = 'javascript:void(0)'
            a.onclick = () => {predictFoal(a)}
        }
        a.innerText = 'Predict'
        return a
    }

    function createRealtoolsSection() {
        const div = document.querySelector('.infotext')

        let lastCell = document.querySelectorAll('.infotext .right')
        lastCell = lastCell[lastCell.length - 1]
        if (!lastCell.innerText) lastCell.innerText = '\u200b'

        const [left, right] = createInfoPair('Realtools', '')

        right.appendChild(createMergeLink())

        // Future versions of Multi's frontend will accept an array of layer
        // URLs as a starting point. Until then, these buttons will not be shown.

        // right.appendChild(document.createTextNode(', '))

        // const hasFoal = !!document.querySelector('.horse_photocon.foal')
        // let n = 'Multi'
        // if (hasFoal) n = 'Multi (mare)'
        // const multiLink = createMultiLink(n)
        // right.appendChild(multiLink)

        // if (hasFoal) {
        //     right.appendChild(document.createTextNode(', '))
        //     right.appendChild(createMultiLink('Multi (foal)', true))
        // }

        if (document.querySelector('.foal')) {
            right.appendChild(document.createTextNode(', '))
            right.appendChild(createVisionLink())
        }

        div.appendChild(left)
        div.appendChild(right)
    }

    createRealtoolsSection()
}


async function mergeImageStorageContainer(mergeButton) {
    await loadStorage()
    if (typeof storage.watermark == 'undefined') {
        storage.watermark = true
    }
    await mergeImage(mergeButton)
}


async function mergeImage(mergeButton) {
    const pageUrl = window.location.href
    if (!hrUrlRegex.test(pageUrl)) return

    if (!mergeButton) {
        mergeButton = document.querySelector('#realtools-merge-button')
        if (!mergeButton) return
    }

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

    let mergedAdultUrl = null
    let mergedFoalUrl = null

    // merge the horse(s)
    if (adultUrls.length > 0) {
        const response = await fetch(`${realtoolsAPI}/merge/multiple`, {
            method: 'POST',
            body: JSON.stringify({
                urls: adultUrls,
                use_watermark: storage.watermark,
            }),
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
    const horse_banner = document.querySelector('.horse_banner')
    horse_banner.insertBefore(layersBox, horse_banner.children[0])

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
    if (document.querySelector('.realtools-powered-tab')) {
        // User is merging their prediction
        const tab_a = document.querySelector('.realtools-powered-tab')
        tab_a.href = realtoolsDomain
        tab_a.innerText = 'Merging & Prediction Powered by Realtools'
    } else {
        const tabnav = document.querySelector('.grid_12.tabnav')
        const tab_a = document.createElement('a')
        tab_a.href = `${realtoolsDomain}/merge`
        tab_a.target = '_blank'
        const tab = document.createElement('div')
        tab.classList = 'realtools-powered-tab'
        tab.appendChild(document.createTextNode('Merging Powered by Realmerge'))
        tab_a.appendChild(tab)
        tabnav.appendChild(tab_a)
    }

    mergeButton.innerText = 'Merged'
}


async function predictFoal(button) {
    if (!horse.foal_layer_keys.length) {
        alert('No foal on this page.')
        return
    }
    const d = document
    if (d.querySelector('.realtools-photocon')) {
        // Merging does not retain the original layer elements. This is a lazy solution.
        alert('Please refresh the page first in order to predict this foal.')
        return
    }

    button.innerText = 'Predicting...'
    button.removeAttribute('href')
    button.onclick = null

    const response = await fetch(`${realtoolsAPI}/predict`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            layer_urls: horse.foal_layer_keys,
            horse_info: {
                lifenumber: horse.lifenumber,
                name: horse.name,
                sex: horse.sex,
                breed: horse.breed,
            }
        }),
    })
    const data = await response.json()

    // error-from-server handling
    if (!response.ok) {
        alert(`Realvision error: ${data.message}`)
        return
    }

    // replace images with prediction
    if (d.querySelector('.horse_photocon.mom')) d.querySelector('.horse_photocon.mom').remove()
    if (d.querySelector('.horse_photocon.foal')) d.querySelector('.horse_photocon.foal').classList.remove('foal')

    const hp = d.querySelector('.horse_photo')
    while (hp.lastChild) hp.lastChild.remove()

    for (const l of data.prediction.layers) {
        const img = d.createElement('img')
        img.src = `https://www.horsereality.com/upload/${l.type}/${l.horse_type}/${l.body_part}/large/${l.id}.png`
        hp.appendChild(img)
    }

    // replace the infobox
    const horse_left = d.querySelector('.horse_left')
    const new_hl = horse_left.cloneNode(true)
    // We want to keep this element so further calls to initializeHorseProfile
    // by other functions will still work correctly
    horse_left.style.display = 'none'
    // We want it to be after the first horse_left
    horse_left.insertAdjacentElement('afterend', new_hl)

    // new_hl.dataset.generator = 'realtools'
    new_hl.id = 'realtools-info-box'
    if (horse.lifenumber != horse.lifenumber) {
        // We fetched a foal page
        const new_name = d.querySelector('#realtools-info-box>h1')
        new_name.innerText = horse.name + ' '

        const sexIcon = d.createElement('img')
        sexIcon.className = 'icon16'
        sexIcon.src = `https://www.horsereality.com/icon/sex-${horse.sex.toLowerCase()}.png`
        sexIcon.alt = horse.sex
        new_name.appendChild(sexIcon)
    }

    const new_it = d.querySelector('#realtools-info-box .infotext')
    while (new_it.lastChild) new_it.lastChild.remove()

    const pairs = {
        Lifenumber: `#${horse.lifenumber}`,
        Breed: horse.breed,
        Phenotype: data.color_info.dilution,
        Color: data.color_info.color,
    }
    for (const label of Object.keys(pairs)) {
        const [left, right] = createInfoPair(label, pairs[label])
        new_it.appendChild(left); new_it.appendChild(right)
    }

    // re-append realtools merge so users can merge the raw layers
    const [rtLeft, rtRight] = createInfoPair('Realtools', '')
    const mergeLink = document.createElement('a')
    mergeLink.id = 'realtools-merge-button'
    mergeLink.href = 'javascript:void(0)'
    mergeLink.onclick = () => {mergeImageStorageContainer(mergeLink)}
    mergeLink.innerText = 'Merge'
    mergeLink.title = 'with Realmerge! :)'
    rtRight.appendChild(mergeLink)
    //rtRight.appendChild(d.createTextNode(', '))

    //const multiLink = document.createElement('a')
    //multiLink.id = 'realtools-multi-button'
    //multiLink.href = `${realtoolsDomain}/merge/multi`
    //multiLink.innerText = 'Multi'
    //rtRight.appendChild(multiLink)

    new_it.appendChild(rtLeft); new_it.appendChild(rtRight)

    // clarify this is only a prediction
    const warning = d.createElement('p')
    const warningText = d.createElement('strong')
    warningText.style.color = '#e11414'
    warningText.appendChild(d.createTextNode('Attention:'))
    warning.appendChild(warningText)
    warning.appendChild(d.createTextNode(' This is just a '))

    const warnVisionLink = d.createElement('a')
    warnVisionLink.href = `${realtoolsDomain}/vision`
    warnVisionLink.innerText = 'prediction'
    warning.appendChild(warnVisionLink)
    warning.appendChild(d.createTextNode(', your foal has not been aged.'))

    new_it.style.marginBottom = '10px'
    new_hl.insertAdjacentElement('beforeend', warning)

    // add a "powered by" pseudo-tab
    const tabnav = document.querySelector('.grid_12.tabnav')
    const tab_a = document.createElement('a')
    tab_a.href = `${realtoolsDomain}/vision`
    tab_a.target = '_blank'
    const tab = document.createElement('div')
    tab.classList = 'realtools-powered-tab'
    tab.appendChild(document.createTextNode('Prediction Powered by Realvision'))
    tab_a.appendChild(tab)
    tabnav.appendChild(tab_a)
}


function createInfoPair(label, value) {
    const left = document.createElement('div')
    left.className = 'left'
    left.innerText = label ?? '\u200b'

    const right = document.createElement('div')
    right.className = 'right'
    right.innerText = value ?? '\u200b'

    return [left, right]
}


window.addEventListener('load', () => {
    if (!horse.name) initializeHorseProfile()
    showButtons()

    if (new URL(window.location.href).searchParams.get('predict') === '1') {
        // Another page redirected here and told us to automatically predict the foal
        if (!horse.looking_at_foal && document.querySelector('.horse_photocon.foal')) {
            // Someone appended the arg to a dam page, go ahead and navigate to the correct place
            const foalUrl = new URL(document.querySelector('.horse_photocon.foal').parentElement.href)
            foalUrl.searchParams.set('predict', '1')
            window.location.href = foalUrl
        } else {
            predictFoal(document.getElementById('realtools-vision-button'))
        }
    }
})
