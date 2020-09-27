// @ts-nocheck
// turned off so we can pass bad values from tests
import {createRegionalI18n} from 'locale/regional';
import REGION_CONTENT from 'locale/translations/region.json';

import {parseRegions, isRegionActive, getExposedHelpURL, getRegionCase, getExposedHelpMenuURL} from './RegionLogic';

const regionalI18n = createRegionalI18n('en', REGION_CONTENT);

describe('can parse region parseRegions([])', () => {
  it('handles and empty array', async () => {
    expect(parseRegions([])).toStrictEqual([]);
  });

  it('handles array with multiple items', async () => {
    expect(new Set(parseRegions(['ON', 'NL']))).toStrictEqual(new Set(['ON', 'NL']));
  });

  it('handles single value', async () => {
    expect(new Set(parseRegions(['ON']))).toStrictEqual(new Set(['ON']));
  });

  it('handles array with an extra space', async () => {
    expect(new Set(parseRegions(['ON', 'NL ']))).toStrictEqual(new Set(['ON', 'NL']));
  });

  it('handles array with lowercase values', async () => {
    expect(new Set(parseRegions(['on', 'nl']))).toStrictEqual(new Set(['ON', 'NL']));
  });
});

describe('isRegionActive', () => {
  it('return true for valid Region', async () => {
    expect(isRegionActive('ON', ['ON', 'NL'])).toStrictEqual(true);
  });

  it('return false for missing Region', async () => {
    expect(isRegionActive('', ['ON', 'NL'])).toStrictEqual(false);
  });

  it('return false for bad Region', async () => {
    expect(isRegionActive('nl', ['ON', 'NL'])).toStrictEqual(false);
  });
});

describe('getRegionCase', () => {
  it('returns noRegionSet', async () => {
    expect(getRegionCase('', ['ON', 'NL'])).toStrictEqual('noRegionSet');
    expect(getRegionCase(null, ['ON', 'NL'])).toStrictEqual('noRegionSet');
    expect(getRegionCase(undefined, ['ON', 'NL'])).toStrictEqual('noRegionSet');
    expect(getRegionCase('', [])).toStrictEqual('noRegionSet');
  });

  it('returns regionActive', async () => {
    expect(getRegionCase('NL', ['ON', 'NL'])).toStrictEqual('regionActive');
  });

  it('returns regionNotActive', async () => {
    expect(getRegionCase('ON', [])).toStrictEqual('regionNotActive');
    expect(getRegionCase('NL', ['ON'])).toStrictEqual('regionNotActive');
  });
});

describe('getExposedHelpURL', () => {
  it('gives the right URL for active regions', async () => {
    ['ON', 'NL', 'NB', 'SK'].forEach(region => {
      expect(getExposedHelpURL(region, regionalI18n)).toStrictEqual(
        regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.URL`),
      );
    });
  });
  it('gives the right URL for inactive regions', async () => {
    ['AB', 'BC', 'MB', 'NT', 'NS', 'NU', 'PE', 'QC', 'YT'].forEach(region => {
      expect(getExposedHelpURL(region, regionalI18n)).toStrictEqual(
        regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.URL`),
      );
    });
  });
  it('gives the right URL if no region is selected', async () => {
    expect(getExposedHelpURL('', regionalI18n)).toStrictEqual(
      regionalI18n.translate('RegionContent.ExposureView.Inactive.CA.URL'),
    );
    expect(getExposedHelpURL(undefined, regionalI18n)).toStrictEqual(
      regionalI18n.translate('RegionContent.ExposureView.Inactive.CA.URL'),
    );
  });
});

describe('getExposedHelpMenuURL', () => {
  it('gives the custom URL if specified', async () => {
    expect(getExposedHelpMenuURL('ON', regionalI18n)).toStrictEqual(
      regionalI18n.translate('RegionContent.Home.ON.ExposedHelpLink'),
    );
  });
  it('gives the default provincial url if no custom is defined', async () => {
    expect(getExposedHelpMenuURL('SK', regionalI18n)).toStrictEqual(
      regionalI18n.translate('RegionContent.ExposureView.Active.SK.URL'),
    );
  });
});
