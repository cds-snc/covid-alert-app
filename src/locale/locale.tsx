import React, {createContext, useMemo, useContext} from 'react';
import {I18n, I18nManager} from '@shopify/react-i18n';
import {createStorageService, useStorage} from 'services/StorageService';
import {captureException} from 'shared/log';

import LOCALES from './translations';
import FALLBACK_LOCALE from './translations/en.json';

const I18nContext = createContext<I18n | undefined>(undefined);

export const createI18n = (locale: string) => {
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
      captureException('i18N', error);
    },
  });
  i18nManager.register({id: 'global'});
  return new I18n([LOCALES[locale], FALLBACK_LOCALE], {...i18nManager.details});
};

export const createBackgroundI18n = async (forceLocale?: string) => {
  const storageService = await createStorageService();
  const locale = forceLocale || storageService.locale.get();
  return createI18n(locale);
};

export interface I18nProviderProps {
  locale?: string;
  children?: React.ReactElement;
}

export const I18nProvider = ({locale: forceLocale, children}: I18nProviderProps) => {
  const {locale: persistedLocale} = useStorage();
  const locale = forceLocale || persistedLocale;
  const i18n = useMemo(() => createI18n(locale), [locale]);
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  return useContext(I18nContext)!!;
};

export {I18n};
