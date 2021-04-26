import React, {createContext, useContext} from 'react';
import {useCachedStorage} from 'services/StorageService';
import {captureMessage} from 'shared/log';
import {Region} from 'shared/Region';
import {resolveObjectPath} from 'shared/resolveObjectPath';
import {parseRegions} from 'shared/RegionLogic';

interface RegionalProviderProps {
  regionContent?: any;
  translate: (id: string) => string;
  children?: React.ReactElement;
  activeRegions: Region[];
}

export const createRegionalI18n = (locale: string, regionContent: any) => {
  const activeRegions = regionContent && regionContent.Active === undefined ? [] : regionContent.Active;

  return {
    locale,
    regionContent,
    activeRegions: parseRegions(activeRegions),
    translate: (id: string): string => {
      const str = resolveObjectPath(`${locale}.${id}`, regionContent);
      if (!str || str === '') {
        captureMessage(`String not found ${id}`);
        return '';
      }
      return str;
    },
  };
};

export const RegionalContext = createContext<RegionalProviderProps | undefined>(undefined);

export const RegionalProvider = ({regionContent, children}: RegionalProviderProps) => {
  const {locale: persistedLocale} = useCachedStorage();
  const locale = persistedLocale;
  const value = createRegionalI18n(locale, regionContent);
  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
};

export const useRegionalI18n = () => {
  return useContext(RegionalContext)!!;
};
