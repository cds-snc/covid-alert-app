import {Region, RegionCase} from './Region';
import {ACTIVE_REGIONS} from 'env';

const defaultRegions: Region[] = ['ON'];

export const parseRegions = (regions: string): string[] => {
  let arr = [];

  if (typeof regions !== 'undefined') {
    arr = regions.split(',');

    if (arr.length < 1 || arr[0] === '') {
      return defaultRegions;
    }

    arr = arr.map(index => {
      return index.toUpperCase().trim();
    });

    return arr;
  }

  return defaultRegions;
};

const onboardedCovered = parseRegions(ACTIVE_REGIONS);

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
