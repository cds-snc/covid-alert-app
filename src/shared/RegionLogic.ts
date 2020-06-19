import {Region, RegionCase} from './Region';

const isRegionCovered = (region: Region) => {
  const onboardedCovered = ['ON'];
  if (onboardedCovered.indexOf(region) > -1) {
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
