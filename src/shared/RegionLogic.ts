import {Region, RegionCase} from './Region';

export const parseRegions = (regions: Region[]): Region[] => {
  const arr = regions.map(index => {
    return <Region>index.toUpperCase().trim();
  });
  return arr;
};

export const isRegionActive = (region: Region | undefined, activeRegions: Region[]) => {
  if (region && parseRegions(activeRegions).indexOf(region) > -1) {
    return true;
  }
  return false;
};

export const getRegionCase = (region: Region | undefined, activeRegions: Region[]) => {
  let regionCase: RegionCase = 'regionNotActive';
  if (!region || region === 'None') {
    regionCase = 'noRegionSet';
  } else if (isRegionActive(region, parseRegions(activeRegions))) {
    regionCase = 'regionActive';
  }
  return regionCase;
};
