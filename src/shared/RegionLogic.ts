import {Region, RegionCase} from './Region';

const onboardedCovered = ['ON'];

export const isRegionCovered = (region: Region | undefined) => {
  if (region && onboardedCovered.indexOf(region) > -1) {
    return true;
  }
  return false;
};

export const getRegionCase = (region: Region | undefined) => {
  let regionCase: RegionCase = 'regionNotCovered';
  if (!region || region === 'None') {
    regionCase = 'noRegionSet';
  } else if (isRegionCovered(region)) {
    regionCase = 'regionCovered';
  }
  return regionCase;
};
