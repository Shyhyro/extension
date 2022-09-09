const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.com\/horses\/(\d{1,10})\/.*/
const layerRegex = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/upload\/[a-z]+\/[a-z]+\/([a-z]+)\/[a-z]+\/([a-z0-9]+)\.png/;
const realtoolsDomain = 'https://realtools.shay.cat'
const realtoolsAPI = 'https://realtools.shay.cat/api/v2'
const storage = {}

async function loadStorage() {
    const data = await browser.storage.sync.get('realtoolsSettings')
    Object.assign(storage, data.realtoolsSettings)
}

function copyText(text) {
    const input = document.createElement('textarea')
  
    input.value = text
  
    input.style.position = 'fixed'
    input.style.opacity = '0'
  
    const root = document.body
    root.append(input)
  
    input.focus()
    input.select()
  
    document.execCommand('copy')
  
    input.remove()
}
