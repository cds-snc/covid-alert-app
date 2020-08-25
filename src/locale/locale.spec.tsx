import merge from 'deepmerge';

import LOCALES from './translations';
import REGION_CONTENT from './translations/region.json';

describe('deep merge', () => {
  it('deep merges objects', async () => {
    const content: any = merge(LOCALES, REGION_CONTENT);
    const localeText = content.en.Home.DiagnosedView.Tip.ON.Body;
    const regionText = content.en.RegionContent.DiagnosedView.Active.ON.Tip.Body;
    expect(localeText).toStrictEqual(regionText);
  });
});
