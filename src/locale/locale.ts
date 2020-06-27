import * as RNLocalize from 'react-native-localize';

export const getSystemLocale = () => {
  const locales = RNLocalize.getLocales();
  return locales.length > 0 ? locales[0].languageCode : 'en';
};
