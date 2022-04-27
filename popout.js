const storage = {};
const watermarkCheck = document.querySelector('#settings-watermark');
const removeWhitesCheck = document.querySelector('#settings-remove-whites');
const nameFormat = document.querySelector('#settings-name-format');
const nameFormatPreview = document.querySelector('#settings-name-format-preview');
const taglineFormat = document.querySelector('#settings-tagline-format');
const taglineFormatPreview = document.querySelector('#settings-tagline-format-preview');
const idDisplayCheck = document.querySelector('#settings-id-display');

String.prototype.format = function() {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
}

function updateFormatPreview(element, string) {
    // https://www.horsereality.com/horses/7763268/i-left-my-hat-in-haiti
    const data = {
      vg: 0,
      gs: 0,
      g: 3,
      ag: 3,
      a: 6,
      ba: 3,
      p: 0,
      wal: "A",
      trt: "A",
      can: "A",
      gal: "G",
      pos: "G",
      hea: "G",
      nck: "A",
      bck: "BA",
      sld: "A",
      flg: "BA",
      hdq: "A",
      sck: "BA",
      dr_vg: "0/4",
      dv_vg: "0/4",
      en_vg: "0/6",
      ev_vg: "0/6",
      rc_vg: "0/7",
      sj_vg: "0/5",
      re_vg: "0/5",
      ls: 64.199,
      ls_r0: "64",
      ls_r1: "64.2",
      ls_r2: "64.20",
      hs: 70.196,
      hs_r0: "70",
      hs_r1: "70.2",
      hs_r2: "70.20",
      rng: "71.127",
      rng_r0: "71",
      rng_r1: "71.1",
      rng_r2: "71.13",
      gp: "662",
      dr: 190,
      dv: 322,
      en: 280,
      ev: 331,
      rc: 263,
      sj: 335,
      re: 282,
      acc: 63,
      agi: 76,
      bal: 52,
      bas: 61,
      pul: 57,
      spd: 65,
      spr: 73,
      sta: 62,
      str: 62,
      sft: 91,
      drp: "64.25",
      dvp: "63.49",
      enp: "68.42",
      evp: "66.61",
      rcp: "65.08",
      sjp: "64.88",
      rep: "68.75",
      bt: "68.20",
      bt_r0: "68",
      bt_r1: "68.2",
      bt_r2: "68.20",
      dr_bt: "44.60",
      dr_bt_r0: "45",
      dr_bt_r1: "44.6",
      dr_bt_r2: "44.60",
      dv_bt: "51.20",
      dv_bt_r0: "51",
      dv_bt_r1: "51.2",
      dv_bt_r2: "51.20",
      en_bt: "49.10",
      en_bt_r0: "49",
      en_bt_r1: "49.1",
      en_bt_r2: "49.10",
      ev_bt: "51.65",
      ev_bt_r0: "52",
      ev_bt_r1: "51.6",
      ev_bt_r2: "51.65",
      rc_bt: "48.25",
      rc_bt_r0: "48",
      rc_bt_r1: "48.2",
      rc_bt_r2: "48.25",
      sj_bt: "51.85",
      sj_bt_r0: "52",
      sj_bt_r1: "51.8",
      sj_bt_r2: "51.85",
      re_bt: "49.20",
      re_bt_r0: "49",
      re_bt_r1: "49.2",
      re_bt_r2: "49.20",
      sex_u: "S",
      sex_l: "s",
      ln: "7763268"
    }
    element.innerText = string.format(data)
}

function updateInputValues(presetType, title) {
    switch (presetType) {
        case 'name':
            nameFormat.value = storage.nameFormats[title]
            nameFormat.placeholder = nameFormat.value
            updateFormatPreview(nameFormatPreview, nameFormat.value)
            break
        case 'tagline':
            taglineFormat.value = storage.taglineFormats[title]
            taglineFormat.placeholder = taglineFormat.value
            updateFormatPreview(taglineFormatPreview, taglineFormat.value)
            break
        default:
            console.warn(`Unknown preset type ${presetType}`)
            break
    }
}

function populateOptions(toSelect, presetType) {
    if (presetType == 'name' || !presetType) {
        const selectElementName = document.getElementById(`presets-select-name`)
        for (const child of selectElementName.children) {child.remove()}

        for (const title of Object.keys(storage.nameFormats)) {
            const option = document.createElement('option')
            option.id = `name-option-${title}`
            if (!document.getElementById(option.id)) {
                option.innerText = title
                option.value = title
                option.selected = (title == toSelect) || (title == Object.keys(storage.nameFormats)[0])
                nameFormat.value = storage.nameFormats[title]
                nameFormat.placeholder = nameFormat.value
                nameFormat.setAttribute('data-preset-title', title)

                selectElementName.appendChild(option)
            }
        }
        if (Object.keys(storage.nameFormats).length < 1) {
            const option = document.createElement('option')
            option.id = `name-option-default`
            if (!document.getElementById(option.id)) {
                option.innerText = 'default'
                option.value = 'default'
                option.selected = true
                nameFormat.value = '{ln}'
                nameFormat.placeholder = nameFormat.value
                nameFormat.setAttribute('data-preset-title', 'default')

                selectElementName.appendChild(option)
            }
        }
        updateFormatPreview(nameFormatPreview, nameFormat.value)
    }

    if (presetType == 'tagline' || !presetType) {
        const selectElementTagline = document.getElementById('presets-select-tagline')
        for (const child of selectElementTagline.children) {child.remove()}

        for (const title of Object.keys(storage.taglineFormats)) {
            const option = document.createElement('option')
            option.id = `tagline-option-${title}`
            if (!document.getElementById(option.id)) {
                option.innerText = title
                option.value = title
                option.selected = (title == toSelect) || (title == Object.keys(storage.taglineFormats)[0])
                taglineFormat.value = storage.taglineFormats[title]
                taglineFormat.placeholder = taglineFormat.value
                taglineFormat.setAttribute('data-preset-title', title)

                selectElementTagline.appendChild(option)
            }
        }
        if (Object.keys(storage.taglineFormats).length < 1) {
            const option = document.createElement('option')
            option.id = `tagline-option-default`
            if (!document.getElementById(option.id)) {
                option.innerText = 'default'
                option.value = 'default'
                option.selected = true
                taglineFormat.value = '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P'
                taglineFormat.placeholder = taglineFormat.value
                taglineFormat.setAttribute('data-preset-title', 'default')

                selectElementTagline.appendChild(option)
            }
        }
        updateFormatPreview(taglineFormatPreview, taglineFormat.value)
    }
}

function newFormatPreset(element, presetType) {
    let presetList = null
    switch (presetType) {
        case 'name':
            presetList = storage.nameFormats
            break
        case 'tagline':
            presetList = storage.taglineFormats
            break
        default:
            console.warn(`Unknown preset type ${presetType}`)
            return
    }

    if (Object.keys(presetList).length >= 15) {
        alert('You can have a maximum of 15 presets.')
        return
    }

    const titleInput = document.createElement('input')
    titleInput.placeholder = 'Input a title...'

    const titleSave = document.createElement('button')
    titleSave.id = `save-button-${presetType}`
    titleSave.innerText = 'Save'
    titleSave.classList = 'yellow'
    titleSave.onclick = async () => {
        const title = titleInput.value.trim()
        if (25 > title.length < 1) {
            titleSave.innerText = 'Title is too long!'
            setTimeout(() => {titleSave.innerText = 'Save'}, 1800)
            return
        }
        presetList[title] = ''
        await browser.storage.sync.set({realtoolsSettings: storage})

        titleInput.remove()
        titleSave.remove()
        populateOptions(title, presetType)
        updateInputValues(presetType, title)
        element.disabled = false
        if (Object.keys(presetList).length >= 15) {
            document.getElementById(`presets-select-${presetType}-new`).style.display = 'none'
        }
        document.getElementById(`presets-select-${presetType}-del`).style.display = 'unset'
        document.getElementById(`settings-${presetType}-format`).disabled = false
    }

    element.disabled = true

    document.getElementById(`settings-${presetType}-format`).disabled = true
    titleInputDiv = document.createElement('div')
    titleInputDiv.appendChild(titleInput)
    titleInputDiv.appendChild(document.createTextNode(' '))
    titleInputDiv.appendChild(titleSave)
    element.parentNode.appendChild(titleInputDiv)
}

function delFormatPreset(title, presetType) {
    let presetList = null
    switch (presetType) {
        case 'name':
            presetList = storage.nameFormats
            break
        case 'tagline':
            presetList = storage.taglineFormats
            break
        default:
            console.warn(`Unknown preset type ${presetType}`)
            return
    }

    delete presetList[title]
    const option = document.getElementById(`${presetType}-option-${title}`)
    if (option) option.remove()
    updateInputValues(presetType, Object.keys(presetList)[0])
    browser.storage.sync.set({realtoolsSettings: storage});
    if (Object.keys(presetList).length <= 1) {
        document.getElementById(`presets-select-${presetType}-del`)
        .style.display = 'none'
    }
    if (Object.keys(presetList).length < 15) {
        document.getElementById(`presets-select-${presetType}-new`)
        .style.display = 'unset'
    }
}

async function init() {
    const data = await browser.storage.sync.get('realtoolsSettings');
    Object.assign(storage, data.realtoolsSettings);
    if (typeof storage.watermark != 'undefined') {watermarkCheck.checked = Boolean(storage.watermark)}
    else {watermarkCheck.checked = true}
    if (typeof storage.remove_whites != 'undefined') {removeWhitesCheck.checked = Boolean(storage.remove_whites)}
    else {removeWhitesCheck.checked = false}
    if (typeof storage.enable_id_display != 'undefined') {idDisplayCheck.checked = Boolean(storage.enable_id_display)}
    else {idDisplayCheck.checked = false}

    // Formatting
    storage.taglineFormats = storage.taglineFormats || {default: '{ln}'}
    storage.nameFormats = storage.nameFormats || {default: '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P'}

    watermarkCheck.addEventListener('click', (event) => {
        storage.watermark = event.target.checked;
        browser.storage.sync.set({realtoolsSettings: storage});
    })
    removeWhitesCheck.addEventListener('click', (event) => {
        storage.remove_whites = event.target.checked;
        browser.storage.sync.set({realtoolsSettings: storage});
    })
    nameFormat.addEventListener('input', (event) => {
        storage.nameFormats[event.target.getAttribute('data-preset-title')] = event.target.value;
        updateFormatPreview(nameFormatPreview, event.target.value)
        browser.storage.sync.set({realtoolsSettings: storage});
    })
    taglineFormat.addEventListener('input', (event) => {
        storage.taglineFormats[event.target.getAttribute('data-preset-title')] = event.target.value;
        updateFormatPreview(taglineFormatPreview, event.target.value)
        browser.storage.sync.set({realtoolsSettings: storage});
    })
    idDisplayCheck.addEventListener('click', (event) => {
        storage.enable_id_display = event.target.checked;
        browser.storage.sync.set({realtoolsSettings: storage});
    })

    populateOptions()
    updateInputValues('name', Object.keys(storage.nameFormats)[0])
    updateInputValues('tagline', Object.keys(storage.taglineFormats)[0])

    if (Object.keys(storage.nameFormats).length <= 1) {
        document.getElementById('presets-select-name-del')
        .style.display = 'none'
    }
    if (Object.keys(storage.nameFormats).length >= 15) {
        document.getElementById('presets-select-name-new')
        .style.display = 'none'
    }
    document.getElementById('presets-select-name-new')
    .addEventListener('click', (event) => {newFormatPreset(event.target, 'name')})
    document.getElementById('presets-select-name-del')
    .addEventListener('click', () => {delFormatPreset(
        document.getElementById('presets-select-name').selectedOptions[0].value,
        'name',
    )})

    if (Object.keys(storage.taglineFormats).length <= 1) {
        document.getElementById('presets-select-tagline-del')
        .style.display = 'none'
    }
    if (Object.keys(storage.taglineFormats).length >= 15) {
        document.getElementById('presets-select-tagline-new')
        .style.display = 'none'
    }
    document.getElementById('presets-select-tagline-new')
    .addEventListener('click', (event) => {newFormatPreset(event.target, 'tagline')})
    document.getElementById('presets-select-tagline-del')
    .addEventListener('click', () => {delFormatPreset(
        document.getElementById('presets-select-tagline').selectedOptions[0].value,
        'tagline',
    )})

    document.getElementById('presets-select-name')
    .addEventListener('change', (event) => {
        nameFormat.setAttribute('data-preset-title', event.target.selectedOptions[0].value)
        updateInputValues('name', event.target.selectedOptions[0].value)
    })
    nameFormat.setAttribute('data-preset-title', document.getElementById('presets-select-name').selectedOptions[0].value)

    document.getElementById('presets-select-tagline')
    .addEventListener('change', (event) => {
        taglineFormat.setAttribute('data-preset-title', event.target.selectedOptions[0].value)
        updateInputValues('tagline', event.target.selectedOptions[0].value)
    })
    taglineFormat.setAttribute('data-preset-title', document.getElementById('presets-select-tagline').selectedOptions[0].value)
}

init();
