/* eslint-disable no-console */
const fs = require('fs');

const {argv} = require('yargs');
const cheerio = require('cheerio');
const htmlToPDF = require('html-pdf-node');

const artifactDir = '../artifacts';

/**
 * Filename of base (source) file to compare agaisnt (displayed on the left).
 * @type String
 */
const base = argv.base;

/**
 * Filename of target file to compare with (displayed on the right).
 * @type String
 */
const target = argv.target;

/**
 * Wraps creation of final .PDF file with Puppeteer
 *
 * @docs https://developers.google.com/web/tools/puppeteer
 *
 * @param {String} fileName
 */
function writePDF(fileName, html) {
  const options = {
    path: `${artifactDir}/${fileName}.pdf`,
    // 210mm is the standard width of an A4 document
    width: '210mm',
    // 297 (the standard height of an A4 document in mm)
    height: '3861mm',
  };

  const file = {content: html};
  // eslint-disable-next-line promise/catch-or-return
  htmlToPDF.generatePdf(file, options).then(pdfBuffer => {
    console.log('PDF Buffer:-', pdfBuffer);
  });
}

/**
 * Creates the final .HTML file
 *
 * @param {String} fileName
 */
function writeHMTL(fileName, comparisonInfo) {
  // eslint-disable-next-line @shopify/prefer-module-scope-constants
  const $ = cheerio.load(`
    <html lang="en-CA">
    <head>
      <meta charset="UTF-8">
      <title>Visual Diff - ${comparisonInfo}</title>
      <style>
      body {
        margin: 0px;
      }
      img {
        height: 600px;
        border: 1px solid #000;
        border-radius: 5px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .split {
        display: flex;
      }
      .titre {
        font-family: sans-serif;
        margin: 0px;
        text-align: center;
        font-size: large;
      }
      .side {
        font-family: sans-serif;
        padding-left: 1%x;
      }
      </style>
    </head>
    <body>
      <header >
        <h1 class='Titre'>${comparisonInfo}</h1>
      </header>
      <div class='split'>
        <div id='leftSide'  class='side'> </div>
        <div id='rightSide' class='side'> <div/>
      </div>
    </body>
    </html>
  `);

  // Read the two input files asynchronously and load them into the master file.

  const leftSideFile = fs.readFileSync(`${artifactDir}/${base}`, {encoding: 'utf8'});
  const left = cheerio.load(leftSideFile);
  $('#leftSide').html(left('body').html());

  const rightSideFile = fs.readFileSync(`${artifactDir}/${target}`, {encoding: 'utf8'});
  const right = cheerio.load(rightSideFile);
  $('#rightSide').html(right('body').html());

  fs.writeFileSync(`${fileName}.html`, $.html(), {encoding: 'utf8'});

  writePDF();
}

/**
 * Extracts the emulator name from test-gallery html fileName.
 *
 * @param {String} filename
 */
function IdOf(filename) {
  const IdChunks = filename.split('.');
  // remove last item (date) + file extension
  IdChunks.splice(IdChunks.length - 2, 2);
  return IdChunks.toString().replace(',', '.');
}

/**
 * Extracts the test-gallery html file timestamp.
 *
 * @param {String} name
 */
function timestampOf(name) {
  const timeChunks = name.split('.');
  // remove last item (date), before the file extension
  return timeChunks[timeChunks.length - 2].toString();
}

(() => {
  // This script is called as follows:
  // node visual-diff.js --base "android.aosp.2021-02-12 20-15-24Z.html" --target "ios.2021-02-12 20-10-56Z.html"
  if (!base && !target) {
    console.log(
      'you need to pass filenames as arguments ex. `node visual-diff.js --base "original.html" --target "feature.html"`',
    );
    return;
  } else if (base && !target) {
    console.log('you need to pass a target filename `--target=""`');
    return;
  } else if (!base && target) {
    console.log('you need to pass a base filename `--target=""`');
    return;
  }

  const sourceId = IdOf(base);
  const targetId = IdOf(target);
  const timestamp = timestampOf(target);

  // should give ex. "visual-diff.2021-01-28 23-28-22Z [ios vs ios].html"
  const comparisonInfo = `${sourceId} vs ${targetId}`;
  const fileName = `${artifactDir}/visualdiff.${timestamp} [${comparisonInfo}]`;
  console.log(`...rendering visual-diff file for files: ${base} && ${target}`);
  writeHMTL(fileName, comparisonInfo);
  console.log(`Done!`);
  return true;
})();
