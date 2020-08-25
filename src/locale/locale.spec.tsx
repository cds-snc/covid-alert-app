import merge from 'deepmerge';

import LOCALES from './translations';
import REGION_CONTENT from './translations/region.json';

describe('deep merge', () => {
  it('deep merges objects', async () => {
    const content: any = merge(LOCALES, REGION_CONTENT);

    const contentTipTitle = content.en.Home.DiagnosedView.Tip.Title;
    const localesTipTitle = LOCALES.en.Home.DiagnosedView.Tip.Title;
    expect(contentTipTitle).toStrictEqual(localesTipTitle);

    const contentTipCTA = content.en.RegionContent.DiagnosedView.Active.ON.Tip.CTA;
    const regionTipCTA = REGION_CONTENT.en.RegionContent.DiagnosedView.Active.ON.Tip.CTA;
    expect(contentTipCTA).toStrictEqual(regionTipCTA);
  });
});
