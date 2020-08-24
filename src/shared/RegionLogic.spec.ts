import {parseRegions} from './RegionLogic';

describe('can parse region', () => {
  it('handles and empty string', async () => {
    expect(parseRegions('')).toEqual(['ON']);
  });

  it('handles comma seperated list', async () => {
    expect(new Set(parseRegions('ON,NL'))).toEqual(new Set(['ON', 'NL']));
  });

  it('handles single value', async () => {
    expect(new Set(parseRegions('ON'))).toEqual(new Set(['ON']));
  });

  it('handles comma seperated list with space', async () => {
    expect(new Set(parseRegions('ON, NL '))).toEqual(new Set(['ON', 'NL']));
  });

  it('handles comma seperated list with lowercase values', async () => {
    expect(new Set(parseRegions('on, nl'))).toEqual(new Set(['ON', 'NL']));
  });
});
