import React, {useEffect, useState} from 'react';
import {useStorage} from 'services/StorageService';
import {ThemeProvider as ThemeProviderRS} from '@shopify/restyle';
import {Region} from 'shared/Region';

import defaultTheme, {Theme} from './default';

interface ThemeProviderProps {
  children?: React.ReactElement;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  // Need to also get value for light/dark theme from storage
  const {region} = useStorage();
  const [theme, setTheme] = useState<Theme>(getThemeWithDefault(region));

  useEffect(() => setTheme(getThemeWithDefault(region)), [region]);

  return <ThemeProviderRS theme={theme}>{children}</ThemeProviderRS>;
};

const getThemeWithDefault = (region?: Region, mode: 'light' | 'dark' = 'light'): Theme => {
  return region ? themes[region][mode] : themes.None[mode];
};

// Add different themes into this map
const themes: Record<Region, {light: Theme; dark: Theme}> = {
  None: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  AB: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  BC: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  MB: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  NB: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  NL: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  NS: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  ON: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  PE: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  QC: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  SK: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  NT: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  NU: {
    light: defaultTheme,
    dark: defaultTheme,
  },
  YT: {
    light: defaultTheme,
    dark: defaultTheme,
  },
};
