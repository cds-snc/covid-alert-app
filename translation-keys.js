const fs = require('fs').promises;
const path = require('path');

const asyncForEach = async (arr, cb) => {
  for (let index = 0; index < arr.length; index++) {
    await cb(arr[index], index, arr);
  }
};

const getRegionContent = async (activeLanguages, contentDirectory) => {
  const data = {};

  await asyncForEach(activeLanguages, async lang => {
    const filePath = path.join(__dirname, contentDirectory, `${lang}.json`);
    data[lang] = await fs.readFile(filePath, 'utf8');
  });

  return data;
};

const resolveObjectPath = (targetPath, obj) => {
  return targetPath.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : '';
  }, obj);
};

/* eslint-disable */
// original https://codegolf.stackexchange.com/questions/195476/extract-all-keys-from-an-object-json
const parseKeys = (obj, str, cb) => {
  !obj | ([obj] == obj) ||
    Object.keys(obj).map(key => {
      parseKeys(obj[key], (key = str ? str + [, key] : key), cb, cb(key));
    });
};
/* eslint-enable */

const parseFiles = (targetPath, languages, regionContent, ignore) => {
  const en = JSON.parse(regionContent[languages[0]]);
  const fr = JSON.parse(regionContent[languages[1]]);
  let missing = '';

  parseKeys(en, undefined, arr => {
    const strPath = arr.split(',').join('.');

    if (!ignore.includes(strPath)) {
      const enStr = resolveObjectPath(strPath, en);
      const frStr = resolveObjectPath(strPath, fr);

      if (typeof enStr === 'string' && enStr && !frStr) {
        missing += ` - Missing FR string: "${strPath}" ${'\n'}`;
      }

      if (typeof frStr === 'string' && frStr && !enStr) {
        missing += ` - Missing EN string: "${strPath}" ${'\n'}`;
      }
    }
  });

  if (!missing) {
    console.log(`${targetPath} ${languages}`, '✅'); // eslint-disable-line no-console
    return;
  }

  console.log(`${targetPath} ${languages}`, '❌'); // eslint-disable-line no-console
  console.log(missing); // eslint-disable-line no-console
};

const contentPaths = ['src/locale/translations', 'src/locale/translations/regional'];

const ingoredKeys = [
  'RegionPicker.ExposedHelpLinkNote.AB',
  'RegionPicker.ExposedHelpLinkNote.BC',
  'RegionPicker.ExposedHelpLinkNote.SK',
];

contentPaths.forEach(async targetPath => {
  const languages = ['en', 'fr'];
  const regionContent = await getRegionContent(languages, targetPath);
  parseFiles(targetPath, languages, regionContent, ingoredKeys);
});
