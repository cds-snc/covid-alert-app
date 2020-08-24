import {parseRegions} from './RegionLogic';

describe('can parse region', () => {
  it('handles and empty string', async () => {
    expect(parseRegions('')).toStrictEqual(['ON']);
  });

  it('handles comma seperated list', async () => {
    expect(new Set(parseRegions('ON,NL'))).toStrictEqual(new Set(['ON', 'NL']));
  });

  it('handles single value', async () => {
    expect(new Set(parseRegions('ON'))).toStrictEqual(new Set(['ON']));
  });

  it('handles comma seperated list with space', async () => {
    expect(new Set(parseRegions('ON, NL '))).toStrictEqual(new Set(['ON', 'NL']));
  });

  it('handles comma seperated list with lowercase values', async () => {
    expect(new Set(parseRegions('on, nl'))).toStrictEqual(new Set(['ON', 'NL']));
  });
});
