/* eslint-disable no-console */
const {resolve} = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const {argv} = require('yargs');
const globby = require('globby');
const cheerio = require('cheerio');
const htmlToPDF = require('html-pdf-node');

const artifactDir = '../artifacts';

/**
 * Filename of base (source) file to compare agaisnt (displayed on the left).
 * @type String
 */
let base = argv.base;

/**
 * Filename of target file to compare with (displayed on the right).
 * @type String
 */
let target = argv.target;

/**
 * The number of Forceable screens
 */
const ForceScreens = calcForceScreens();

/**
 * Gets the number of forcable screen dynamically.
 * Note that loading TypeScript, in Node, is complicated,
 *  and this is a workaround.
 * @returns the number of forcable screens in ForceScreen.ts
 */
function calcForceScreens() {
  const sharedFile = fs.readFileSync('../src/shared/ForceScreen.ts', 'utf8');
  let screens = 0;

  for (const line of sharedFile.trim().split('\n')) {
    if (!line.includes('=')) continue;
    screens++;
  }
  return screens;
}

/**
 * The number of screenshots of the app to parse.
 * We don't know this in advance, but default to minimum.
 */
let screenshots = 11;

/**
 * Will check the target directory for the number of files they contain
 */
function calcAppScreens(baseDir, targetDir) {
  const baseIMGs = globby.sync(`${artifactDir}/${baseDir}/**/*.png`, {}, (err, files) => {
    if (err) return console.log(err);

    console.log(files);
  }).length;

  const targetIMGs = globby.sync(`${artifactDir}/${targetDir}/**/*.png`, {}, (err, files) => {
    if (err) return console.log(err);

    console.log(files);
  }).length;

  setAppScreens(Math.max(screenshots, baseIMGs, targetIMGs));
}

function setAppScreens(screens) {
  console.log(`...need ${screens} screens of vertical height in PDF`);
  screenshots = screens;
}

/**
 * The margin amount of the output PDF.
 */
const PDFmargin = '0.5cm';

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
    preferCSSPageSize: true,
    printBackground: true,
    // 210mm is the standard width of an A4 document
    width: '8.5in',
    // 297 (the standard height of an A4 document in mm)
    height: `${ForceScreens * 20.4 + (screenshots - ForceScreens) * 17}cm`,
    margin: {
      top: PDFmargin,
      left: PDFmargin,
      right: PDFmargin,
      bottom: PDFmargin,
    },
  };

  const pdfURL = `file://${resolve(`${artifactDir}/${fileName}.html`)}`;
  console.log(`Attempting to write PDF (${options.width} x ${options.height})...
              \nfile location: ${pdfURL}`);

  // eslint-disable-next-line promise/catch-or-return
  htmlToPDF.generatePdf({url: pdfURL}, options).then(pdfBuffer => {
    console.log('PDF Buffer:', pdfBuffer ? 'has many bytes' : 'totally empty');
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
        width: 22em;
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

  // Read the two input files asynchronously and load them into the output file.
  const leftSideFile = fs.readFileSync(`${artifactDir}/${base}`, {encoding: 'utf8'});

  const left = cheerio.load(leftSideFile);
  $('#leftSide').html(left('body').html());

  const rightSideFile = fs.readFileSync(`${artifactDir}/${target}`, {encoding: 'utf8'});
  const right = cheerio.load(rightSideFile);
  $('#rightSide').html(right('body').html());

  if (!screenshots) {
    const leftIMGs = left('body img').length;
    const rightIMGs = right('body img').length;
    setAppScreens(Math.max(screenshots, leftIMGs, rightIMGs));
  }

  const content = $.html();
  fs.writeFileSync(`${fileName}.html`, content, {encoding: 'utf8'});

  return writePDF(fileName, content);
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
    console.log(`No --base and --target parameters!
    \nYou need to provide either folder names from the ../artifacts directory,
    \nor HTML files output by the test-gallery ex:
    \n\t node visual-diff.js --base 'original[.html]' --target 'feature[.html]'
    `);
    process.exit(9);
  } else if (base && !target) {
    console.log('No --target argument received');
    process.exit(9);
  } else if (!base && target) {
    console.log('No --base argument received');
    process.exit(9);
  }
  const baseResolved = fs.existsSync(`${resolve(`${artifactDir}/${base}`)}`);
  const targetResolved = fs.existsSync(`${resolve(`${artifactDir}/${target}`)}`);

  if (!base.endsWith('.html') && !target.endsWith('.html')) {
    console.log(`Assuming --base and --target are folder names...`);
    calcAppScreens(base, target);
    execSync(`yarn test-gallery --dir "${base}" --silent`, {stdio: 'inherit'});
    base = `${base}.html`;
    execSync(`yarn test-gallery --dir "${target}" --silent`, {stdio: 'inherit'});
    target = `${target}.html`;
  } else if (!baseResolved && !targetResolved) {
    console.log(`Invalid --base and --target parameters! Files not found
    \nVerify files exist and are not empty.
    `);
    process.exit(9);
  } else if (!baseResolved && targetResolved) {
    console.log('Invalid --base argument, file not found');
    process.exit(9);
  } else if (baseResolved && !targetResolved) {
    console.log('Invalid --target argument, file not found');
    process.exit(9);
  }

  const sourceId = IdOf(base);
  const targetId = IdOf(target);
  const timestamp = timestampOf(target);

  // should give ex. "visual-diff.2021-01-28 23-28-22Z [ios vs ios].html"
  const comparisonInfo = `${sourceId} vs ${targetId}`;
  const fileName = `${artifactDir}/visualdiff.${timestamp} [${comparisonInfo}]`;
  console.log(`...rendering visual-diff for : ${base} && ${target}`);
  return writeHMTL(fileName, comparisonInfo);
})();
