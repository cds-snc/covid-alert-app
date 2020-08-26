import React, {createContext, useContext} from 'react';
import {useStorage} from 'services/StorageService';
import {captureMessage} from 'shared/log';
import {Region} from 'shared/Region';
import {resolveObjectPath} from 'shared/resolveObjectPath';

interface RegionalProviderProps {
  regionContent?: any;
  translate?: (id: string) => string;
  children?: React.ReactElement;
  activeRegions: Region[] | [];
}

export const createRegionalI18n = (locale: string, content: any) => {
  return {
    locale,
    regionContent: content,
    activeRegions: content && content.Active === undefined ? [] : content.Active,
    translate: (id: string): string => {
      const str = resolveObjectPath(`${locale}.${id}`, content);
      if (!str || str === '') {
        captureMessage(`String not found ${id}`);
      }
      return str;
    },
  };
};

export const RegionalContext = createContext<RegionalProviderProps | undefined>(undefined);

export const RegionalProvider = ({regionContent, children}: RegionalProviderProps) => {
  const {locale: persistedLocale} = useStorage();
  const locale = persistedLocale;
  const value = createRegionalI18n(locale, regionContent);
  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
};

export const useRegionalI18n = () => {
  return useContext(RegionalContext)!!;
};
