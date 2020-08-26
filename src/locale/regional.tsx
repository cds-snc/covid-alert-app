import React, {createContext, useContext} from 'react';
import {useStorage} from 'services/StorageService';
import {resolveObjectPath} from '../shared/resolveObjectPath';
import {captureMessage} from 'shared/log';

type RegionalProviderProps = {
  content?: any;
  translate: (id: string) => string;
  children?: React.ReactElement;
};

export const createRegionalI18n = (locale: string, content: any) => {
  return {
    locale: locale,
    content: content,
    translate: (id: string) => {
      try {
        const str = resolveObjectPath(`${locale}.${id}`, content);
        if (!str || str === '') {
          captureMessage(`String not found ${id}`);
        }
        captureMessage(`String found ${id}`);
        return str;
      } catch (e) {
        return 'not ready';
      }
    },
  };
};

export const RegionalContext = createContext<RegionalProviderProps | undefined>(undefined);

export const RegionalProvider = ({content, children}: RegionalProviderProps) => {
  const {locale: persistedLocale} = useStorage();
  const locale = persistedLocale;

  const value = createRegionalI18n(locale, content);

  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
};

export const useRegionalI18n = () => {
  return useContext(RegionalContext)!!;
};
