import * as RNLocalize from 'react-native-localize';

export const getSystemLocale = (): string => {
  const locales = RNLocalize.getLocales();
  return locales?.length > 0 ? locales[0].languageCode : 'en';
};
