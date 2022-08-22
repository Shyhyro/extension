const hrUrlRegex = /^https:\/\/(v2\.|www\.)?horsereality\.com\/horses\/(\d{1,10})\/.*/
const layerRegex = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/upload\/[a-z]+\/[a-z]+\/([a-z]+)\/[a-z]+\/([a-z0-9]+)\.png/;
const realtoolsDomain = 'https://realtools.shay.cat'
const realtoolsAPI = 'https://realtools.shay.cat/api/v2'
const storage = {}

async function loadStorage() {
    const data = await browser.storage.sync.get('realtoolsSettings')
    Object.assign(storage, data.realtoolsSettings)
}
