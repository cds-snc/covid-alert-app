const fs = require('fs').promises;
const path = require('path');

const contentDirectory = 'src/locale/translations';
const languages = ['en', 'fr'];
const regions = ['ON', 'NL', 'NB', 'SK', 'MB', 'QC', 'PE', 'NS', 'NT'];
const outputFilename = 'region.json';

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const getRegionContent = async activeLanguages => {
  const data = {};

  await asyncForEach(activeLanguages, async lang => {
    const filePath = path.join(__dirname, contentDirectory, 'regional', `${lang}.json`);
    data[lang] = await fs.readFile(filePath, 'utf8');
  });

  return data;
};

const writeFile = options => {
  const {regions: active, regionContent, filePath} = options;

  const json = {
    Active: active,
  };

  // add keys for each language
  for (const [key, value] of Object.entries(regionContent)) {
    json[key] = JSON.parse(value);
  }

  fs.writeFile(filePath, JSON.stringify(json), err => {
    if (err) return console.log(err); // eslint-disable-line no-console
  });
};

(async () => {
  const regionContent = await getRegionContent(languages);
  const filePath = path.join(__dirname, contentDirectory, outputFilename);
  writeFile({regions, regionContent, filePath});
})();
