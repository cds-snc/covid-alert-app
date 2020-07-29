import {ExposureConfigurationValidationError, ExposureConfigurationValidator} from './ExposureConfigurationValidator';
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

  it('check bad configuration with missing: minimumRiskScore', async () => {
    const exposureConfig1: any = {
      attenuationLevelValues: [0, 0, 2, 2, 2, 2, 2, 2],
      attenuationWeight: 50,
      daysSinceLastExposureLevelValues: [0, 1, 1, 1, 1, 1, 1, 1],
      daysSinceLastExposureWeight: 50,
      durationLevelValues: [0, 0, 0, 0, 5, 5, 5, 5],
      durationWeight: 50,
      transmissionRiskLevelValues: [1, 1, 1, 1, 1, 1, 1, 1],
      transmissionRiskWeight: 50,
    };

    let validatorError;
    try {
      new ExposureConfigurationValidator().validateExposureConfiguration(exposureConfig1, exposureConfigurationSchema);
    } catch (error) {
      validatorError = error;
    }
    expect(validatorError).toStrictEqual(
      new ExposureConfigurationValidationError(
        'Invalid Exposure Configuration JSON. instance requires property "minimumRiskScore"',
      ),
    );
  });
});
