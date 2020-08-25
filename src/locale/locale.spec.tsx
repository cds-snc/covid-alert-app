import merge from 'deepmerge';
import LOCALES from './translations';
import REGION_CONTENT from './translations/region.json';

describe('createCancellableCallbackPromise', () => {
  it('does not call callback if the promise has been canceled before being called', async () => {
    const content: any = merge(LOCALES, REGION_CONTENT);
    const localeText = content['en']['Home']['DiagnosedView']['Tip']['ON']['Body'];
    const regionText = content['en']['RegionalContent']['DiagnosedView']['Active']['ON']['Tip']['Body'];
    expect(localeText).toEqual(regionText);
  });
});
