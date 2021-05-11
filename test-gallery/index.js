/* eslint-disable no-console */
const fs = require('fs');

const globby = require('globby');
const {argv} = require('yargs');

const dirPattern = `../artifacts/${argv.dir}`;
const fileName = `${dirPattern}.html`;
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const styledTitle = val => {
  let style = 'color:green;';
  if (val.indexOf('✗') !== -1) {
    style = 'color:red;';
  }
  return `\n\t<h3 style="${style}">${val}</h3>`;
};

const imgHTML = async path => {
  const images = await globby(path, {
    onlyFiles: false,
  });

  let html = '';

  if (images.length >= 1) {
    images.forEach(img => {
      html += `\n\t\t<img src="${img}">`;
    });
  } else {
    html += `no images for test`;
  }

  return html;
};

const writeFile = content => {
  const title = `${argv.dir}`.replace(/@/g, '/');
  let html = `
  <html lang="en-CA">
  <head>
    <meta charset="UTF-8">
    <title>Test-Gallery - ${title}</title>
    <style>
      body {
        margin: 20px;
        font-family: sans-serif;
      }
      img {
        height: 800px;
        border: 1px solid #000;
        border-radius: 5px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    </style>
    </head>
    <body>
      <header >
        <h1 class='Titre'>${title}</h1>
      </header>
    `;

  html += content;
  html += '\n</body>\n\n</html>';

  fs.writeFile(fileName, html, function (err) {
    if (err) return console.log(err);
  });
};

(async () => {
  //  node index.js --dir="ios.2020-08-19 17-21-59Z"
  if (!argv.dir) {
    console.log('you need to pass a directory name');
    return -1;
  }
  console.log('render file for: ', argv.dir);

  const paths = await globby(dirPattern, {
    onlyFiles: false,
  });

  let html = '';

  await asyncForEach(paths, async path => {
    if (path.indexOf('.png') !== -1) {
      // we're only looking for directories
      return;
    }

    const img = await imgHTML(path);
    html += styledTitle(path) + img;
  });

  return writeFile(html);
})();
