import {ExposureConfigurationValidator} from './ExposureConfigurationValidator';
import exposureConfigurationDefault from './ExposureConfigurationDefault.json';
import exposureConfigurationSchema from './ExposureConfigurationSchema.json';

describe('ExposureConfigurationValidator', () => {
  it('Validates the default config', async () => {
    const result = new ExposureConfigurationValidator().validateExposureConfiguration(
      exposureConfigurationDefault,
      exposureConfigurationSchema,
    );

    expect(result.errors.length).toEqual(0);
  });
});
