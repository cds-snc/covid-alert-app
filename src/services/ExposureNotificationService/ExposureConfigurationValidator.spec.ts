import {ExposureConfigurationValidator} from './ExposureConfigurationValidator';
import exposureConfigurationDefault from './ExposureConfigurationDefault.json';
import exposureConfigurationSchema from './ExposureConfigurationSchema.json';

describe('ExposureConfigurationValidator', () => {
  it('validates the default config', async () => {
    const result = new ExposureConfigurationValidator().validateExposureConfiguration(
      exposureConfigurationDefault,
      exposureConfigurationSchema,
    );

    expect(result.errors).toHaveLength(0);
  });
});
