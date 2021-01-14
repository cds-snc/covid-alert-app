const fs = require('fs').promises;
const path = require('path');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const getRegionContent = async languages => {
  let data = {};

  await asyncForEach(languages, async lang => {
    const filePath = path.join(__dirname, `${lang}-region.json`);
    data[lang] = await fs.readFile(filePath, 'utf8');
  });

  return data;
};

const writeFile = options => {
  const {regions, regionContent, filePath} = options;

  let json = {
    Active: regions,
  };

  // add keys for each language
  for (const [key, value] of Object.entries(regionContent)) {
    json[key] = JSON.parse(value);
  }

  fs.writeFile(filePath, JSON.stringify(json), err => {
    if (err) return console.log(err);
  });
};

(async () => {
  const languages = ['en', 'fr'];
  const regions = ['ON', 'NL', 'NB', 'SK', 'MB', 'QC', 'PE', 'NS', 'NT'];
  const regionContent = await getRegionContent(languages);
  const filePath = path.join(__dirname, 'gen1-region.json');
  writeFile({regions, regionContent, filePath: filePath});
})();
