// @ts-nocheck
// turned off so we can pass bad values from tests
import {parseRegions, isRegionActive, getRegionCase} from './RegionLogic';

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
  });

  it('regionActive', async () => {
    expect(getRegionCase('NL', ['ON', 'NL'])).toStrictEqual('regionActive');
  });
});
