import {Region, RegionCase} from './Region';

export const parseRegions = (regions: string[]): Region[] => {
  const arr = regions.map(index => {
    return index.toUpperCase().trim() as Region;
  });
  return arr;
};

export const isRegionActive = (region: Region | undefined, activeRegions: Region[]) => {
  if (region && activeRegions.indexOf(region) > -1) {
    return true;
  }
  return false;
};

export const getRegionCase = (region: Region | undefined, activeRegions: Region[]) => {
  let regionCase: RegionCase = 'regionNotActive';
  if (!region || region === 'None') {
    regionCase = 'noRegionSet';
  } else if (isRegionActive(region, activeRegions)) {
    regionCase = 'regionActive';
  }
  return regionCase;
};

export function getExposedHelpURL(region: Region | undefined, regionalI18n: any) {
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const nationalURL = regionalI18n.translate(`RegionContent.ExposureView.Inactive.CA.URL`);
  if (region !== undefined && region !== 'None') {
    const regionalURL = regionActive
      ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.URL`)
      : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.URL`);
    if (regionalURL === '') {
      return nationalURL;
    }
    return regionalURL;
  }
  return nationalURL;
}

export function getExposedHelpMenuURL(region: Region | undefined, regionalI18n: any) {
  if (region !== undefined && region !== 'None') {
    const regionalURL = regionalI18n.translate(`RegionContent.Home.${region}.ExposedHelpLink`);
    if (regionalURL !== '') {
      return regionalURL;
    }
  }
  return getExposedHelpURL(region, regionalI18n);
}
