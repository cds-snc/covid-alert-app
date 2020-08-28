import {createRegionalI18n} from './regional';
import REGION_CONTENT from './translations/region.json';

const regionalI18n = createRegionalI18n('en', REGION_CONTENT);
const activeRegions = regionalI18n.activeRegions;

describe('if region is active', () => {
  it('has the last paragraph text for ExposureView', async () => {
    activeRegions.forEach((region: string) => {
      expect(regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.Body`)).not.toStrictEqual('');
    });
  });

  it('has all the required NoCode Content', async () => {
    activeRegions.forEach((region: string) => {
      expect(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Title`)).not.toStrictEqual('');
      expect(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body`)).not.toStrictEqual('');
      expect(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.CTA`)).not.toStrictEqual('');
      expect(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Link`)).not.toStrictEqual('');
    });
  });
});
