const css = `
/* hr overrides */
.horse_left h1 {display: inline}
.horse_left {width: 290px}
.looking_at {margin-left: 350px; width: 570px}
button.yellow, input[type=submit].yellow {transition: background-color 0.2s}
.horse_photocon.foal.realmerge-photocon {width: 261px; height: 515px; margin: 0}
.horse_photocon.foal.realmerge-photocon>.horse_photo {margin: 0; width: 0; position: static}
button.yellow[disabled], input[type=submit].yellow[disabled] {background: gray;cursor: not-allowed}
.genetic_potential {width:75px}
.genetic_stats {width:auto}

/* custom */
.realtools-layers-slider, .realmerge-layers-slider {text-align: left; overflow-x: auto; display: flex; z-index: 1; scrollbar-width: thin}
.realtools-layers-slider>img, .realmerge-layers-slider>img {height: 70px; background: rgba(206,206,206,0.85); margin-right: 10px}
.realtools-merged-result, .realmerge-merged-result {background: rgba(255,255,255,0.85)}
.realtools-merged-result.foal, .realmerge-merged-result.foal {margin: 0 !important}
.realtools-powered-tab, .realmerge-powered-tab {
    float: right;
    margin-right: 1px;
    padding: 5px 10px;
    background-color: #c6d6db;
    text-align: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: initial;
}
.realtools-powered-tab:hover, .realmerge-powered-tab:hover {text-decoration: underline}
.realtools-tablekey {background-color: #f3d197}
.realtools-noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
`

function main() {
    const style = document.createElement('style');
    style.id = 'realtools-custom-style';
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}
main();
