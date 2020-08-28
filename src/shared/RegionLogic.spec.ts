// @ts-nocheck
// turned off so we can pass bad values from tests
import {parseRegions} from './RegionLogic';

describe('can parse region', () => {
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
