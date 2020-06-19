import {Region} from './Region';

const isRegionCovered = (region: Region) => {
  const onboardedCovered = ['ON'];
  if (onboardedCovered.indexOf(region) > -1) {
    return true;
  }
  return false;
};

export const getRegionCase = (region: Region | undefined) => {
  type RegionCase = 'regionNotCovered' | 'noRegionSet' | 'regionCovered';
  let regionCase: RegionCase = 'regionNotCovered';
  if (!region) {
    regionCase = 'noRegionSet';
  } else if (isRegionCovered(region)) {
    regionCase = 'regionCovered';
  }
  return regionCase;
};
