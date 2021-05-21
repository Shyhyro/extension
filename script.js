const regexPattern = /^https:\/\/(v2\.|www\.)?horsereality\.(com|nl)\/horses\/(\d{3,10})\/.*/

async function init() {
    const currentTabs = await chrome.tabs.query({active: true, currentWindow: true});
    const currentTab = currentTabs[0];
    const currentUrl = currentTab.url;

    if (!regexPattern.test(currentUrl)) {
        document.getElementById('error-invalid-url').style.display = 'block';
        const body = document.getElementsByTagName("body")[0];
        body.innerHTML = '<p style="padding:10px;margin:0">This page is not a valid horse page. <a href="https://realmerge.shay.cat" target="_blank">Visit the main website here</a>.</p>';
        body.style.height = '20px';
        body.style.width = '230px';
        return
    } else {
        await mergeImage(currentUrl);
        return
    }
}
init();

function displayError(message) {
    document.getElementById('error-message').innerHTML = message;
    document.getElementById('error-box').style.display = 'block';
    document.getElementById('merged-image-box').style.display = 'none';
}

async function mergeImage(url) {
    // basic UX in case the request takes a long time
    document.getElementById('merged-image-title').innerHTML = 'Processing...';
    document.getElementById('merged-image').src = '';

    document.getElementById('merged-image-box').style.display = 'block';
    document.getElementById('merged-image-title').innerHTML = 'Merging...';

    const response = await fetch('https://realmerge.shay.cat/api/merge', {
        method: 'POST',
        body: JSON.stringify({url: url}),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    if (!response.ok) {
        displayError(data.message);
        return
    } else {
        document.getElementById('error-box').style.display = 'none';
        document.getElementById('merged-image-box').style.display = 'block';
        // it might be hidden if the previous
        // request resulted in an error
    };

    document.getElementById('merged-image').src = data.url;
    if (!data.name) {
        document.getElementById('merged-image-title').innerHTML = 'Merged Image';
    } else {
        document.getElementById('merged-image-title').innerHTML = data.name;
    }
}
