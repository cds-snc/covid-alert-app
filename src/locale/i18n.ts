import {I18n, I18nManager} from '@shopify/react-i18n';
import {createStorageService} from 'services/StorageService';

import LOCALES from './translations';

export const getBackgroundI18n = async (forceLocale?: string) => {
  const storageService = await createStorageService();
  const locale = forceLocale || storageService.locale.get();
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
      console.log('>>> i18N', error);
    },
  });
  const translations = (locale: string) => LOCALES[locale];
  i18nManager.register({id: 'global', translations, fallback: LOCALES[locale]});
  const i18n = new I18n(LOCALES[locale], {...i18nManager.details});
  return i18n;
};
