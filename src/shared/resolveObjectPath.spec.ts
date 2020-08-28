import REGION_CONTENT from '../locale/translations/region.json';

import {resolveObjectPath} from './resolveObjectPath';

describe('resolveObjectPath', () => {
  it('can pull object values using dot syntax', async () => {
    const myObj = {en: {content: {CTA: 'Get more information'}}};
    expect(resolveObjectPath('en.content.CTA', myObj)).toStrictEqual('Get more information');
  });

  it('can pull from region content', async () => {
    expect(resolveObjectPath('en.RegionContent.ExposureView.Active.NL.CTA', REGION_CONTENT)).toStrictEqual(
      'Find out what to do next',
    );
  });

  it('can pull from region content using locale', async () => {
    const locale = 'en';
    expect(resolveObjectPath(`${locale}.RegionContent.ExposureView.Active.NL.CTA`, REGION_CONTENT)).toStrictEqual(
      'Find out what to do next',
    );
  });

  it('returns empty string if the id does not exist', async () => {
    const locale = 'en';
    expect(resolveObjectPath(`${locale}.RegionContent�.ExposureView.Active.NL.CTA`, REGION_CONTENT)).toStrictEqual('');
  });
});
