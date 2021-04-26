const fs = require('fs').promises;
const path = require('path');

const contentDirectory = 'src/locale/translations';
const outputFilename = 'strings.xml';
// add strings here i.e. ['AppName', 'NoExposureDetected.RegionCovered.Title']
const stringPaths = ['AppName'];

const resolveObjectPath = (stringPath, obj) => {
  return stringPath.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : '';
  }, obj);
};

const camelCaseToUnderScore = str => {
  return str
    .split(/(?=[A-Z])/g)
    .join('_')
    .split('.')
    .join('')
    .toLowerCase();
};

const getLocaleContent = async lang => {
  const filePath = path.join(__dirname, contentDirectory, `${lang}.json`);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeFile = options => {
  const {content, filePath} = options;

  let xml = '<resources>\n';

  stringPaths.forEach(strPath => {
    const str = resolveObjectPath(`Home.${strPath}`, content);
    const name = camelCaseToUnderScore(strPath);
    xml += `\t<string name="${name}">${str}</string>\n`;
  });

  xml += '</resources>';

  fs.writeFile(filePath, xml, err => {
    if (err) return console.log('error writing file', err); // eslint-disable-line no-console
  });
};

const writeXml = async (lang = '') => {
  const basePath = 'android/app/src/main/res/values';
  const outputDirectory = lang === '' ? `${basePath}/` : `${basePath}-${lang}/`;
  const content = await getLocaleContent(lang || 'en');
  const filePath = path.join(__dirname, outputDirectory, outputFilename);
  writeFile({content, filePath});
};

(async () => {
  // defaults to en
  await writeXml();
  await writeXml('fr');
})();
