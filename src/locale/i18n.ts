import {I18n, I18nManager} from '@shopify/react-i18n';
import {StorageService} from 'services/StorageService';

import LOCALES from './translations';

export const getBackgroundI18n = async (forceLocale?: string) => {
  const storageService = new StorageService();
  return new Promise<I18n>(resolve => {
    storageService.ready.observe(ready => {
      if (!ready) {
        return;
      }
      const locale = forceLocale || storageService.locale.value;
      const i18nManager = new I18nManager({
        locale,
        onError(error) {
          console.log(error.message);
        },
      });
      const translations = (locale: string) => LOCALES[locale];
      i18nManager.register({id: 'global', translations, fallback: LOCALES[locale]});
      const i18n = new I18n(LOCALES[locale], {...i18nManager.details});
      resolve(i18n);
    });
  });
};
