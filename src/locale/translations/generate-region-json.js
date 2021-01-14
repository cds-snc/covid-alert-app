const fs = require('fs').promises;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const getRegionContent = async languages => {
  let data = {};

  await asyncForEach(languages, async lang => {
    data[lang] = await fs.readFile(`${lang}-region.json`, 'utf8');
  });

  return data;
};

const writeFile = options => {
  const {regions, regionContent, fileName} = options;

  let json = {
    Active: regions,
  };

  // add keys for each language
  for (const [key, value] of Object.entries(regionContent)) {
    json[key] = JSON.parse(value);
  }

  fs.writeFile(fileName, JSON.stringify(json), err => {
    if (err) return console.log(err);
  });
};

(async () => {
  const languages = ['en', 'fr'];
  const regions = ['ON', 'NL', 'NB', 'SK', 'MB', 'QC', 'PE', 'NS', 'NT'];
  const regionContent = await getRegionContent(languages);
  writeFile({regions, regionContent, fileName: 'gen-region.json'});
})();
