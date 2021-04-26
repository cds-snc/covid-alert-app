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
  return `<h3 style="${style}">${val}</h3>`;
};

const imgHTML = async path => {
  const images = await globby(path, {
    onlyFiles: false,
  });

  let html = '';

  if (images.length >= 1) {
    images.forEach(img => {
      html += `<img src="${img}">`;
    });
  } else {
    html += `no images for test`;
  }

  return html;
};

const writeFile = content => {
  let html =
    '<html><head><style>body { margin: 20px; font-family: sans-serif; } img{ width: 150px;border:1px solid #000; margin: 10px}</style></head><body>';

  html += content;
  html += '</body></html>';

  fs.writeFile(fileName, html, function (err) {
    if (err) return console.log(err); // eslint-disable-line no-console
  });
};

(async () => {
  //  node index.js --dir="ios.2020-08-19 17-21-59Z"
  if (!argv.dir) {
    console.log('you need to pass a directory name'); // eslint-disable-line no-console
    return;
  }

  console.log('render file for: ', argv.dir); // eslint-disable-line no-console

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

  writeFile(html);
})();
