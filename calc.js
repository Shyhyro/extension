const adviceSentences = {
    walk: [
        {bracket: 'excellent', sentence: /powerful and balanced step/},
        {bracket: 'good', sentence: /decent amount of elasticity while walking/},
        {bracket: 'average', sentence: /toes are dragging just a touch/},
        {bracket: 'fair', sentence: /four beat walk is a little off/},
        {bracket: 'poor', sentence: /walk is way too wide/}
    ],
    trot: [
        {bracket: 'excellent', sentence: /has an amazing two-beat rhythm/},
        {bracket: 'good', sentence: /impulsion in working trot is off to a good start/},
        {bracket: 'average', sentence: /engagement is lacking a bit when/},
        {bracket: 'fair', sentence: /passable trot but not too fancy/},
        {bracket: 'poor', sentence: /trot, you can see it is flat and lacking suspension/}
    ],
    canter: [
        {bracket: 'excellent', sentence: /that is a very elegant looking canter with a nice three-beat gait/},
        {bracket: 'good', sentence: /canter under control easily/},
        {bracket: 'average', sentence: /needs more motivation to move, seems more like a trot than canter/},
        {bracket: 'fair', sentence: /has a bit of difficulty with changing leads/},
        {bracket: 'poor', sentence: /that canter needs quite some work before it looks like anything really/}
    ],
    gallop: [
        {bracket: 'excellent', sentence: /seems to have a balanced and very smooth gallop/},
        {bracket: 'good', sentence: /gallop is under control and has some nice extended strides/},
        {bracket: 'average', sentence: /could have a bit more impulsion in gallop/},
        {bracket: 'fair', sentence: /has a bit of trouble stopping in gallop\. might wanna work on that/},
        {bracket: 'poor', sentence: /is completely out of control, where are the breaks/}
    ],
    posture: [
        {bracket: 'excellent', sentence: /posture is perfectly balanced/},
        {bracket: 'good', sentence: /seems to stand straight and keeps/},
        {bracket: 'average', sentence: /(seems to stand pretty stable like any other horse|seems to hold up like any other horse)/},
        {bracket: 'fair', sentence: /seems to be leaning a bit\. posture needs work/},
        {bracket: 'poor', sentence: /has a very imbalanced posture and stands instable/}
    ],
    head: [
        {bracket: 'excellent', sentence: /looking closer at (his|her) head, (he|she) shows some nice proportions/},
        {bracket: 'good', sentence: /head looks pretty elegant/},
        {bracket: 'average', sentence: /head seems ok(ay)?\. not too bad/},
        {bracket: 'fair', sentence: /head is somewhat off proportion/},
        {bracket: 'poor', sentence: /that's one funky looking horse head/}
    ],
    neck: [
        {bracket: 'excellent', sentence: /has great elasticity in the shoulder/},
        {bracket: 'good', sentence: /has good shoulder muscles working/},
        {bracket: 'average', sentence: /shoulders? could be a bit more upright/},
        {bracket: 'fair', sentence: /shoulder is a bit lazy/},
        {bracket: 'poor', sentence: /has extremely stiff shoulders/}
    ],
    back: [
        {bracket: 'excellent', sentence: /back will be heaven for a rider, flexible but sturdy/},
        {bracket: 'good', sentence: /back movement is flatter and quieter/},
        {bracket: 'average', sentence: /if you look at (his|her) back, it is a bit stiff, but not too bad/},
        {bracket: 'fair', sentence: /back is kind of too long/},
        {bracket: 'poor', sentence: /lacks flexibility and has a stiff, rigid back/}
    ],
    shoulders: [
        {bracket: 'excellent', sentence: /has great elasticity in the shoulder/},
        {bracket: 'good', sentence: /has good shoulder muscles working/},
        {bracket: 'average', sentence: /shoulders? could be a bit more upright/},
        {bracket: 'fair', sentence: /shoulder is a bit lazy/},
        {bracket: 'poor', sentence: /has extremely stiff shoulders/}
    ],
    hindquarters: [
        {bracket: 'excellent', sentence: /there's great engagement in the hindquarters/},
        {bracket: 'good', sentence: /there's good muscle on the hindquarters/},
        {bracket: 'average', sentence: /i guess those hindquarters are passable/},
        {bracket: 'fair', sentence: /hindquarters are looking a little wonky, they're hanging too much/},
        {bracket: 'poor', sentence: /those are some weak looking hindquarters/}
    ],
    frontlegs: [
        {bracket: 'excellent', sentence: /front legs are practically identical, nice symmetry and standing straight/},
        {bracket: 'good', sentence: /front legs have some solid lines going/},
        {bracket: 'average', sentence: /front legs seem ok(ay)?, nothing wrong with them/},
        {bracket: 'fair', sentence: /front legs are off symmetry/},
        {bracket: 'poor', sentence: /front legs are not really standing straight/}
    ],
    socks: [
        {bracket: 'excellent', sentence: /feathering is amazing and looks thick/},
        {bracket: 'good', sentence: /has a good amount of feathering going on/},
        {bracket: 'average', sentence: /feathering looks ok(ay)?/},
        {bracket: 'fair', sentence: /feathering is a little all over the place, (he|she) looks like a hobbit/},
        {bracket: 'poor', sentence: /see those skimpy legs\? no feathering at all/}
    ]
}
let conformationParagraphs = '';
let qualityResults = {very_good_plus: 0, very_good: 0, very_good_minus: 0, good_plus: 0, good: 0, average: 0, below_average: 0, poor: 0};
let qualityStats = {};
let confTraits = {};
let lowestScore = null;
let highestScore = null;
let lowestResult = null;
let highestResult = null;
let geneticPotential = null;
let breed = '';
let rangeAmount = 6.928;
const confScores = {
    dressage: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    driving: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    endurance: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    eventing: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    flat_racing: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    show_jumping: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0},
    western_reining: {percentage: 0, average: 0, conformation: 0, max: 0, min: 0}
}
const gpTraits = {};
let gpResults = [];
let horseIsFoal = false;
const calculatedValues = {
    quality: false
}
const qualityMap = {
    poor: {max: 39, min: 1},
    below_average: {max: 59, min: 40},
    average: {max: 69, min: 60},
    good: {max: 79, min: 70},
    good_plus: {max: 84, min: 80},
    very_good_minus: {max: 89, min: 85},
    very_good: {max: 100, min: 85},
    very_good_plus: {max: 100, min: 91}
}

const traitsGenTraitsMap = {
    dressage: ['walk', 'trot', 'canter', 'posture'],
    driving: ['trot', 'back', 'shoulders', 'hindquarters'],
    endurance: ['walk', 'trot', 'canter', 'head', 'neck', 'back'],
    eventing: ['walk',  'trot', 'canter', 'posture', 'head', 'neck'],
    flat_racing: ['gallop', 'posture', 'neck', 'back', 'shoulders', 'frontlegs', 'hindquarters'],
    show_jumping: ['canter', 'back', 'shoulders', 'frontlegs', 'hindquarters'],
    western_reining: ['head', 'neck', 'shoulders', 'frontlegs', 'hindquarters']
}

function parseTableColumn(column, props={}) {
    const keyClass = props.keyClass || 'genetic_potential';
    const makeNumber = props.makeNumber || false;
    let currentIndex = 0;
    const result = {};
    for (const element of column.children) {
        if (element.classList.contains(keyClass)) {
            const value = column.children[currentIndex+1].innerText;
            if (makeNumber) {
                result[element.innerText.trim().toLowerCase().replace(' ', '_')] = Number(value.trim());
            } else {
                result[element.innerText.trim().toLowerCase().replace(' ', '_')] = value.trim();
            }
        }
        currentIndex += 1;
    }
    return result
}

function replaceInColumn(column, key, newValue, props={}) {
    const keyClass = props.keyClass || 'genetic_potential';
    let currentIndex = 0;
    let replacedElements = [];
    for (const element of column.children) {
        if (element.classList.contains(keyClass) & element.innerText.trim() == key.trim()) {
            column.children[currentIndex+1].innerHTML = newValue;
            replacedElements.push(element);
        }
        currentIndex += 1;
    }
    return replacedElements
}

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

let currentTab = null;
let initialTabCookie = null;

function getCookie(cookieName) {
    const name = cookieName + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if ((c.indexOf(name)) == 0) {
            return c.substr(name.length);
        }
    }
    return null
}

function setCookie(cookie) {
    document.cookie = `${cookie.name}=${cookie.value}; samesite=lax; path=/`;
}

async function getTabContent(tabName) {
    const formData = new FormData();
    formData.append('hid', document.querySelector('#hid').value);
    formData.append('newtab', tabName);

    const response = await fetch(
        `${document.location.origin}/ajax/update_horsetab.php`, {
            method: 'POST',
            body: formData
        }
    );

    const returnedContent = await response.text();
    document.getElementById(tabName).innerHTML = returnedContent;
    const parser = new DOMParser();
    return parser.parseFromString(returnedContent, 'text/html');
}

let geneticsTabDoc = null;
async function preloadTabs() {
    async function genetics() {
        const tab = document.getElementById('tab_genetics2');
        doc = geneticsTabDoc
        if (tab != currentTab) {
            // make sure there's no weird overlap
            if (tab == currentTab) tab.style.display == 'block'
            else tab.style.display = tab.style.display || 'none'
        }
        conformationParagraphs = doc.getElementsByClassName('curly-quotes')[0].innerText.trim().toLowerCase();

        // gp
        const geneticPotentialTable = doc.getElementsByClassName('grid_6 genetics')[1].children[1];
        geneticPotential = doc.getElementsByClassName('grid_6 genetics')[1].children[0].children[0].innerText.replace('GP total: ','');
        Object.assign(gpTraits, parseTableColumn(geneticPotentialTable.children[0], {makeNumber: true}));
        Object.assign(gpTraits, parseTableColumn(geneticPotentialTable.children[1], {makeNumber: true}));
        gpResults = [
            {trait: 'Dressage', value: gpTraits.agility + gpTraits.balance + gpTraits.strength},
            {trait: 'Driving', value: gpTraits.agility + gpTraits.pulling_power + gpTraits.speed + gpTraits.stamina + gpTraits.strength},
            {trait: 'Endurance', value: gpTraits.speed + gpTraits.stamina + gpTraits.strength + gpTraits.surefootedness},
            {trait: 'Eventing', value: gpTraits.balance + gpTraits.bascule + gpTraits.speed + gpTraits.strength + gpTraits.surefootedness},
            {trait: 'Flat Racing', value: gpTraits.acceleration + gpTraits.speed + gpTraits.sprint + gpTraits.stamina},
            {trait: 'Show Jumping', value: gpTraits.acceleration + gpTraits.agility + gpTraits.bascule + gpTraits.sprint + gpTraits.strength},
            {trait: 'Western Reining', value: gpTraits.acceleration + gpTraits.agility + gpTraits.balance + gpTraits.surefootedness}
        ];

        // create the third column
        const thirdColumn = doc.createElement('div');
        thirdColumn.classList = ['right'];
        thirdColumn.style.width = '40%';

        for (const calculated of gpResults) {
            const traitNameUsable = calculated.trait.toLowerCase().replace(' ', '_');
            // averages
            let divideAmount = 1
            switch (traitNameUsable) {
                case 'dressage':
                    divideAmount = 3
                    break
                case 'driving':
                    divideAmount = 5
                    break
                case 'endurance':
                    divideAmount = 4
                    break
                case 'eventing':
                    divideAmount = 5
                    break
                case 'flat_racing':
                    divideAmount = 4
                    break
                case 'show_jumping':
                    divideAmount = 5
                    break
                case 'western_reining':
                    divideAmount = 4
                    break
                default:
                    break
            }
            confScores[traitNameUsable].value = calculated.value;
            confScores[traitNameUsable].average = calculated.value / divideAmount;

            const acceptableTraits = traitsGenTraitsMap[traitNameUsable];
            for (const type of Object.keys(qualityStats)) {
                const value = qualityStats[type];

                if (acceptableTraits.indexOf(type) != -1) {
                    confScores[traitNameUsable].max += qualityMap[value].max;
                    confScores[traitNameUsable].min += qualityMap[value].min;
                }
            }

            for (const scoreType of Object.keys(confScores)) {
                // conf average
                const values = confScores[scoreType];

                let min = values.min;

                // the spreadsheet does this for some reason, so we do too
                if (scoreType != 'dressage') {
                    const acceptableTraits = traitsGenTraitsMap[scoreType];
                    if (qualityStats.shoulders == 'good_plus' & acceptableTraits.indexOf('shoulders') != -1) {
                        min -= 4;
                    }
                    if (qualityStats.neck == 'good_plus' & acceptableTraits.indexOf('neck') != -1) {
                        min -= 4;
                    }
                }

                const divideAmount = traitsGenTraitsMap[scoreType].length * 2;
                confScores[scoreType].conformation = (values.max + min) / divideAmount;
                
                // percentage
                const rawValue = (0.75 * confScores[scoreType].average) + (0.25 * confScores[scoreType].conformation);
                confScores[scoreType].percentage = Number.parseFloat(rawValue).toPrecision(4);
            }
            
            // third column
            const rowKey = doc.createElement('div');
            rowKey.classList = ['genetic_potential realtools-tablekey'];
            rowKey.innerText = calculated.trait;

            const rowValue = doc.createElement('div');
            rowValue.classList = ['genetic_stats'];
            rowValue.innerText = `${calculated.value} (${confScores[traitNameUsable].percentage})`;

            thirdColumn.appendChild(rowKey);
            thirdColumn.appendChild(rowValue);
        }
        // style existing columns
        geneticPotentialTable.children[0].style.width = '30%';
        geneticPotentialTable.children[1].style.width = '30%';
        geneticPotentialTable.children[1].classList = ['left'];
        // add the third column
        geneticPotentialTable.appendChild(thirdColumn)

        tab.innerHTML = doc.children[0].innerHTML;
    }

    async function achievements() {
        const tab = document.getElementById('tab_achievements2');
        
        // make sure there's no weird overlap
        if (tab == currentTab) tab.style.display == 'block'
        else tab.style.display = tab.style.display || 'none'

        const doc = await getTabContent('tab_achievements2');

        // load data itself
        const conformationBox = doc.querySelector('.conformation');
        const conformationTable = conformationBox.children[1];
        Object.assign(confTraits, parseTableColumn(conformationTable.children[0]));
        Object.assign(confTraits, parseTableColumn(conformationTable.children[1]));

        // VG/G+/... counter
        Object.keys(confTraits).forEach((traitName) => {
            const value = confTraits[traitName];
            if (typeof adviceSentences[traitName] == 'undefined') {
                qualityResults[value.toLowerCase().replace(' ', '_')] += 1;
            } else {
                for (const sentenceItem of adviceSentences[traitName]) {
                    const match = conformationParagraphs.match(sentenceItem.sentence);
                    if (match) {
                        if (value == 'Good' & sentenceItem.bracket == 'excellent') {
                            qualityResults.good_plus += 1;
                            qualityStats[traitName.toLowerCase()] = 'good_plus';
                        } else {
                            qualityResults[value.toLowerCase().replace(' ', '_')] += 1;
                            qualityStats[traitName.toLowerCase()] = value.toLowerCase().replace(' ', '_');//.replace('good+', 'good_plus');
                        }
                        break
                    }
                }
            }
        });
        // patch neck/shoulders according to the majority of spreadsheet calculators
        if (qualityStats.neck == 'good' & ['very_good', 'good', 'good_plus'].indexOf(qualityStats.shoulders) != -1 & conformationParagraphs.match(adviceSentences.neck[0].sentence)) {
            qualityResults[qualityStats.neck] -= 1;
            qualityStats.neck = 'good_plus';
            qualityResults.good_plus += 1;
        }
        if (qualityStats.shoulders == 'good' & ['very_good', 'good', 'good_plus'].indexOf(qualityStats.neck) != -1 & conformationParagraphs.match(adviceSentences.shoulders[0].sentence)) {
            qualityResults[qualityStats.shoulders] -= 1;
            qualityStats.shoulders = 'good_plus';
            qualityResults.good_plus += 1;
        }

        // compensate for very good plus: neck
        if (qualityStats.neck == 'very_good' & qualityStats.shoulders == 'good') {
        } else {
            qualityStats.neck == 'very_good_minus'
        }
        if (qualityStats.neck == 'very_good' & qualityStats.shoulders == 'average') {
            qualityStats.neck == 'very_good_plus'
        } else {
            qualityStats.neck == 'very_good'
        }
        // compensate for very good plus: shoulders
        if (qualityStats.shoulders == 'very_good' & qualityStats.neck == 'good') {
        } else {
            qualityStats.shoulders == 'very_good_minus'
        }
        if (qualityStats.shoulders == 'very_good' & qualityStats.neck == 'average') {
            qualityStats.shoulders == 'very_good_plus'
        } else {
            qualityStats.shoulders == 'very_good'
        }

        Object.keys(qualityStats).forEach((traitNameLower) => {
            const value = qualityStats[traitNameLower];
            if (value == 'good_plus') {
                const traitNameUpper = traitNameLower.charAt(0).toUpperCase() + traitNameLower.slice(1);
                replaceInColumn(conformationTable.children[0], traitNameUpper, 'Good<span class="realtools-noselect">+</span>');
                replaceInColumn(conformationTable.children[1], traitNameUpper, 'Good<span class="realtools-noselect">+</span>');
            }
        })

        let conformationString = 'Conformation - ';
        if (qualityResults.very_good) conformationString += `<span style="color:#57BB8A">${qualityResults.very_good_minus + qualityResults.very_good + qualityResults.very_good_plus}VG</span> `;
        if (qualityResults.good_plus) conformationString += `<span style="color:#9BC67B">${qualityResults.good_plus}G+</span> `;
        if (qualityResults.good) conformationString += `<span style="color:#D5D06F">${qualityResults.good}G</span> `;
        if (qualityResults.average) conformationString += `<span style="color:#FED467">${qualityResults.average}A</span> `;
        if (qualityResults.below_average) conformationString += `<span style="color:#EE9A6F">${qualityResults.below_average}BA</span> `;
        if (qualityResults.poor) conformationString += `<span style="color:#E67C73">${qualityResults.poor}P</span>`;

        conformationBox.children[0].innerHTML = conformationString

        // min & max show values
        const scoresBlock = doc.querySelector('.grid_6.half_block');
        if (scoresBlock.children.length < 4) {
            lowestScore = '';
            highestScore = '';
        } else {
            for (const row of scoresBlock.children) {
                if (row.classList.contains('row_460')) {
                    let value = row.children[2].innerText;  // col_90, has image and value
                    value = Number(value);
                    if (!lowestScore) lowestScore = value;
                    if (!highestScore) highestScore = value;

                    if (value < lowestScore) lowestScore = value;
                    else if (value > highestScore) highestScore = value;
                }
            }
        }

        if (lowestScore != '') {
            const showTitle = scoresBlock.children[0];
            showTitle.innerHTML = 'Latest 25 show results';
            showTitle.innerHTML += `<span style="float:right"><span style="color:gray;font-size:0.8em">Visible:</span> ${highestScore} / ${lowestScore}</span>`;
        }

        // min & max competition values
        const resultsBlock = doc.getElementsByClassName('half_block')[1];
        if (resultsBlock.children.length < 4) {
            lowestResult = '';
            highestResult = '';
        } else {
            for (const row of resultsBlock.children) {
                if (row.classList.contains('row_460')) {
                    let value = row.children[2].innerText;  // col_90, has image and value
                    value = Number(value);
                    if (!lowestResult) lowestResult = value;
                    if (!highestResult) highestResult = value;

                    if (value < lowestResult) lowestResult = value;
                    else if (value > highestResult) highestResult = value;
                }
            }
        }

        if (lowestResult != '') {
            const showTitle = resultsBlock.children[0];
            showTitle.innerHTML = 'Latest 25 competition results';
            showTitle.innerHTML += `<span style="float:right"><span style="color:gray;font-size:0.8em">Visible:</span> ${highestResult} / ${lowestResult}</span>`;
        }

        tab.innerHTML = doc.children[0].innerHTML;
    }

    async function updates() {
        const tab = document.getElementById('tab_update2');
        const doc = await getTabContent('tab_update2');
        
        // make sure there's no weird overlap
        if (tab == currentTab) tab.style.display == 'block';
        else tab.style.display = tab.style.display || 'none';

        tab.innerHTML = doc.children[0].innerHTML;

        const formattedStrings = await generateTaglineAndName();
        function tagline() {
            const taglineInput = document.querySelector('#changetagline');
            if (!taglineInput) return

            taglineInput.placeholder = formattedStrings.taglines.default

            const fillTagline = document.createElement('select')
            const defOption = document.createElement('option')
            defOption.innerText = 'Select a preset'
            defOption.selected = true
            defOption.disabled = true
            defOption.value = null
            fillTagline.appendChild(defOption)

            for (const title of Object.keys(formattedStrings.taglines)) {
                const option = document.createElement('option')
                option.innerText = title
                option.value = formattedStrings.taglines[title]
                fillTagline.appendChild(option)
            }

            fillTagline.id = 'realtools-use-tagline-button'
            fillTagline.onchange = () => {
                taglineInput.value = fillTagline.selectedOptions[0].value
                taglineInput.placeholder = fillTagline.selectedOptions[0].value
            }
            fillTagline.appendChild(document.createTextNode('Fill auto-tagline'))
            fillTagline.form = null
            taglineInput.parentNode.appendChild(fillTagline)
        }
        function name() {
            const nameInput = document.querySelector('#changename');
            if (!nameInput) return

            nameInput.placeholder = formattedStrings.names.default

            const fillName = document.createElement('select')
            const defOption = document.createElement('option')
            defOption.innerText = 'Select a preset'
            defOption.selected = true
            defOption.disabled = true
            defOption.value = null
            fillName.appendChild(defOption)

            for (const title of Object.keys(formattedStrings.names)) {
                const option = document.createElement('option')
                option.innerText = title
                option.value = formattedStrings.names[title]
                fillName.appendChild(option)
            }

            fillName.id = 'realtools-use-name-button'
            fillName.onchange = () => {
                nameInput.value = fillName.selectedOptions[0].value
                nameInput.placeholder = fillName.selectedOptions[0].value
            }
            fillName.appendChild(document.createTextNode('Fill auto-name'))
            fillName.form = null
            nameInput.parentNode.appendChild(fillName)
        }
        tagline();
        name();

        if (storage.show_debug_options === true) {
            // Holds the update button
            const container = document.querySelector('.update-horseinfo').parentNode

            const debugButton = document.createElement('button')
            debugButton.innerText = 'Print values'
            debugButton.onclick = () => {
                console.log(formattedStrings)
                console.log(formatDataGenerator())
            }
            debugButton.classList = 'dark'
            debugButton.form = null
            debugButton.style = 'margin-left: 4px;'

            container.appendChild(debugButton)
        }
    }

    const geneticsTab = document.getElementById('tab_genetics2');
    if (geneticsTab != currentTab) {
        // make sure there's no weird overlap
        if (geneticsTab == currentTab) geneticsTab.style.display == 'block'
        else geneticsTab.style.display = geneticsTab.style.display || 'none'
    }
    geneticsTabDoc = await getTabContent('tab_genetics2');
    conformationParagraphs = geneticsTabDoc.getElementsByClassName('curly-quotes')[0].innerText.trim().toLowerCase();
    await achievements();
    await genetics();
    await updates();

    // HR sets a cookie whenever you request a new tab, so we reset it
    // here to what we assume was its original value
    setCookie({name: 'selected_horse_tab', value: initialTabCookie});
}

function getInitialTab() {
    const initialTab = document.querySelector('option[selected="selected"]')
    if (initialTab) {
        const tabDiv = document.getElementById(initialTab.value);
        currentTab = document.getElementById(tabDiv.lang);
        initialTabCookie = getCookie('selected_horse_tab');
    } else {
        return
    }
    preloadTabs();
}

function isFoal() {
    const looking_at = document.querySelector('.looking_at');
    if (looking_at && looking_at.classList == 'looking_at') {
        // mare & foal using banner
        horseIsFoal = looking_at.innerText.indexOf('foal') != -1;
    } else if (document.querySelector('.horse_photocon.foal') && document.querySelector('.icon16').alt != 'Mare') {
        // mare & foal but banner is not present
        horseIsFoal = true;
    } else if (document.querySelector('.foal')) {
        // only foal
        horseIsFoal = true;
    }
    return horseIsFoal
}

function getSex() {
    const overall = document.querySelector('.icon16').alt;
    isFoal();
    if (overall == 'Stallion') {
        if (horseIsFoal) {
            return 'C'
        } else {
            return 'S'
        }
    } else if (overall == 'Gelding') {
        if (horseIsFoal) {
            return 'C'  // I don't think this can happen
        } else {
            return 'G'
        }
    } else if (overall == 'Mare') {
        if (horseIsFoal) {
            return 'F'
        } else {
            return 'M'
        }
    }
    return '?'
}

function formatDataGenerator() {
    const breedTotal = (num, round) => {return (((Number(num) / 10) + highestScore) / 2).toPrecision(round)}
    const highScores = (num, round) => {if (num == '') {return num} else {return Number.parseFloat(num).toPrecision(round)}}
    const prettyConformationStat = (stat) => {
        const split = stat.toUpperCase().split('_')
        let firstLetters = ''
        for (const l of split) firstLetters += l[0]

        return stat === 'good_plus'
        ? 'G+'
        : firstLetters
    }
    const sumDiscipline = (discipline, requiredQualities) => {
        let has = 0
        let requiredStats = []

        switch (discipline) {
            case 'dressage':
                requiredStats = ['walk', 'trot', 'canter', 'posture']
                break
            case 'driving':
                requiredStats = ['trot', 'back', 'shoulders', 'hindquarters']
                break
            case 'endurance':
                requiredStats = ['walk', 'trot', 'canter', 'head', 'neck', 'back']
                break
            case 'eventing':
                requiredStats = ['walk', 'trot', 'canter', 'posture', 'head', 'neck']
                break
            case 'flat_racing':
                requiredStats = ['gallop', 'posture', 'neck', 'back', 'shoulders', 'frontlegs', 'hindquarters']
                break
            case 'show_jumping':
                requiredStats = ['canter', 'back', 'shoulders', 'frontlegs', 'hindquarters']
                break
            case 'western_reining':
                requiredStats = ['head', 'neck', 'shoulders', 'frontlegs', 'hindquarters']
                break
            default:
                break
        }

        for (const stat of Object.keys(qualityStats)) {
            const value = qualityStats[stat]
            if (requiredQualities.includes(value)) {
                if (requiredStats.includes(stat)) has += 1
            }
        }

        return `${has}/${requiredStats.length}`
    }

    if (breed === 'Icelandic Horse') rangeAmount = 6.062
    let lowestScorePlusRange = lowestScore
    if (lowestScore) lowestScorePlusRange += rangeAmount

    return {
        // Conformation
        vg: qualityResults.very_good,
        gs: qualityResults.good_plus,
        g: qualityResults.good,
        ag: qualityResults.good + qualityResults.good_plus,  // all good
        a: qualityResults.average,
        ba: qualityResults.below_average,
        p: qualityResults.poor,

        wal: prettyConformationStat(qualityStats.walk),
        trt: prettyConformationStat(qualityStats.trot),
        can: prettyConformationStat(qualityStats.canter),
        gal: prettyConformationStat(qualityStats.gallop),
        pos: prettyConformationStat(qualityStats.posture),
        hea: prettyConformationStat(qualityStats.head),
        nck: prettyConformationStat(qualityStats.neck),
        bck: prettyConformationStat(qualityStats.back),
        sld: prettyConformationStat(qualityStats.shoulders),
        flg: prettyConformationStat(qualityStats.frontlegs),
        hdq: prettyConformationStat(qualityStats.hindquarters),
        sck: prettyConformationStat(qualityStats.socks),

        dr_g: sumDiscipline('dressage', ['good']),
        dr_gs: sumDiscipline('dressage', ['good_plus']),
        dr_ag: sumDiscipline('dressage', ['good', 'good_plus']),
        dr_vg: sumDiscipline('dressage', ['very_good']),
        dv_g: sumDiscipline('driving', ['good']),
        dv_gs: sumDiscipline('driving', ['good_plus']),
        dv_ag: sumDiscipline('driving', ['good', 'good_plus']),
        dv_vg: sumDiscipline('driving', ['very_good']),
        en_g: sumDiscipline('endurance', ['good']),
        en_gs: sumDiscipline('endurance', ['good_plus']),
        en_ag: sumDiscipline('endurance', ['good', 'good_plus']),
        en_vg: sumDiscipline('endurance', ['very_good']),
        ev_g: sumDiscipline('eventing', ['good']),
        ev_gs: sumDiscipline('eventing', ['good_plus']),
        ev_ag: sumDiscipline('eventing', ['good', 'good_plus']),
        ev_vg: sumDiscipline('eventing', ['very_good']),
        rc_g: sumDiscipline('flat_racing', ['good']),
        rc_gs: sumDiscipline('flat_racing', ['good_plus']),
        rc_ag: sumDiscipline('flat_racing', ['good', 'good_plus']),
        rc_vg: sumDiscipline('flat_racing', ['very_good']),
        sj_g: sumDiscipline('show_jumping', ['good']),
        sj_gs: sumDiscipline('show_jumping', ['good_plus']),
        sj_ag: sumDiscipline('show_jumping', ['good', 'good_plus']),
        sj_vg: sumDiscipline('show_jumping', ['very_good']),
        re_g: sumDiscipline('western_reining', ['good']),
        re_gs: sumDiscipline('western_reining', ['good_plus']),
        re_ag: sumDiscipline('western_reining', ['good', 'good_plus']),
        re_vg: sumDiscipline('western_reining', ['very_good']),

        // scores
        ls: lowestScore,
        ls_r0: highScores(lowestScore, 2),
        ls_r1: highScores(lowestScore, 3),
        ls_r2: highScores(lowestScore, 4),
        hs: highestScore,
        hs_r0: highScores(highestScore, 2),
        hs_r1: highScores(highestScore, 3),
        hs_r2: highScores(highestScore, 4),

        // range
        rng: highScores(lowestScorePlusRange, 5),
        rng_r0: highScores(lowestScorePlusRange, 2),
        rng_r1: highScores(lowestScorePlusRange, 3),
        rng_r2: highScores(lowestScorePlusRange, 4),

        // Genetic Potential
        gp: geneticPotential.trim(),
        dr: gpResults[0].value,
        dv: gpResults[1].value,
        en: gpResults[2].value,
        ev: gpResults[3].value,
        rc: gpResults[4].value,
        sj: gpResults[5].value,
        re: gpResults[6].value,

        acc: gpTraits.acceleration,
        agi: gpTraits.agility,
        bal: gpTraits.balance,
        bas: gpTraits.bascule,
        pul: gpTraits.pulling_power,
        spd: gpTraits.speed,
        spr: gpTraits.sprint,
        sta: gpTraits.stamina,
        str: gpTraits.strength,
        sft: gpTraits.surefootedness,

        // percentages
        drp: confScores.dressage.percentage,
        dvp: confScores.driving.percentage,
        enp: confScores.endurance.percentage,
        evp: confScores.eventing.percentage,
        rcp: confScores.flat_racing.percentage,
        sjp: confScores.show_jumping.percentage,
        rep: confScores.western_reining.percentage,

        // Other
        // breed total
        bt: breedTotal(geneticPotential.trim(), 4),
        bt_r0: breedTotal(geneticPotential.trim(), 2),
        bt_r1: breedTotal(geneticPotential.trim(), 3),
        bt_r2: breedTotal(geneticPotential.trim(), 4),

        dr_bt: breedTotal(gpResults[0].value, 4),
        dr_bt_r0: breedTotal(gpResults[0].value, 2),
        dr_bt_r1: breedTotal(gpResults[0].value, 3),
        dr_bt_r2: breedTotal(gpResults[0].value, 4),

        dv_bt: breedTotal(gpResults[1].value, 4),
        dv_bt_r0: breedTotal(gpResults[1].value, 2),
        dv_bt_r1: breedTotal(gpResults[1].value, 3),
        dv_bt_r2: breedTotal(gpResults[1].value, 4),

        en_bt: breedTotal(gpResults[2].value, 4),
        en_bt_r0: breedTotal(gpResults[2].value, 2),
        en_bt_r1: breedTotal(gpResults[2].value, 3),
        en_bt_r2: breedTotal(gpResults[2].value, 4),

        ev_bt: breedTotal(gpResults[3].value, 4),
        ev_bt_r0: breedTotal(gpResults[3].value, 2),
        ev_bt_r1: breedTotal(gpResults[3].value, 3),
        ev_bt_r2: breedTotal(gpResults[3].value, 4),

        rc_bt: breedTotal(gpResults[4].value, 4),
        rc_bt_r0: breedTotal(gpResults[4].value, 2),
        rc_bt_r1: breedTotal(gpResults[4].value, 3),
        rc_bt_r2: breedTotal(gpResults[4].value, 4),

        sj_bt: breedTotal(gpResults[5].value, 4),
        sj_bt_r0: breedTotal(gpResults[5].value, 2),
        sj_bt_r1: breedTotal(gpResults[5].value, 3),
        sj_bt_r2: breedTotal(gpResults[5].value, 4),

        re_bt: breedTotal(gpResults[6].value, 4),
        re_bt_r0: breedTotal(gpResults[6].value, 2),
        re_bt_r1: breedTotal(gpResults[6].value, 3),
        re_bt_r2: breedTotal(gpResults[6].value, 4),

        // more other
        sex_u: getSex(),
        sex_l: getSex().toLowerCase(),
        ln: document.querySelector('#hid').value
    }
}

async function generateTaglineAndName() {
    // get storage
    const storageData = await browser.storage.sync.get('realtoolsSettings');

    Object.assign(storage, storageData.realtoolsSettings);
    if (typeof storage.watermark == 'undefined') {storage.watermark = true}

    storage.nameFormats = storage.nameFormats || {default: '{ln}'}
    storage.taglineFormats = storage.taglineFormats || {default: '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P'}
    //storage.nameFormats.default = storage.nameFormats.default || '{ln}'
    //storage.taglineFormats.default = storage.taglineFormats.default || '{vg}VG {gs}G+ {g}G {a}A {ba}BA {p}P'

    const formattedNames = {}
    const formattedTaglines = {}
    const formatData = formatDataGenerator()

    for (const title of Object.keys(storage.nameFormats)) {
        formattedNames[title] = storage.nameFormats[title].format(formatData)
    }
    for (const title of Object.keys(storage.taglineFormats)) {
        formattedTaglines[title] = storage.taglineFormats[title].format(formatData)
    }

    // compile format data
    return {
        names: formattedNames,
        taglines: formattedTaglines,
    }
}

window.addEventListener('load', () => {
    breed = document.getElementsByClassName('right')[1].innerText;
    // Prone to breaking if more `right` elements are added that appear before this one

    getInitialTab();

    // implement our own listener for tab switching
    const tabs = document.getElementsByClassName('tabclick');
    for (const tab of tabs) {
        tab.addEventListener('click', () => {
            if (currentTab != document.getElementById(tab.lang)) {
                currentTab = document.getElementById(tab.lang);
                setCookie({name: 'selected_horse_tab', value: currentTab.id.replace('tab_','').replace('2','')});
            }
        })
    }
})
