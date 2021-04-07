import {ExposureConfigurationValidationError, ExposureConfigurationValidator} from '../ExposureConfigurationValidator';
import exposureConfigurationDefault from '../ExposureConfigurationDefault.json';
import exposureConfigurationSchema from '../ExposureConfigurationSchema.json';

describe('ExposureConfigurationValidator', () => {
  it('verify the schema is parseable JSON with bare minimum of properties', () => {
    expect(exposureConfigurationSchema).toHaveProperty('$schema');
    expect(exposureConfigurationSchema).toHaveProperty('title');
    expect(exposureConfigurationSchema).toHaveProperty('properties');
  });

  it('verify the default config is parseable JSON with bare minimum of properties', () => {
    expect(exposureConfigurationDefault).toHaveProperty('minimumRiskScore');
    expect(exposureConfigurationDefault).toHaveProperty('attenuationLevelValues');
  });

  it('validates the default config', () => {
    const result = new ExposureConfigurationValidator().validateExposureConfiguration(
      exposureConfigurationDefault,
      exposureConfigurationSchema,
    );

    expect(result.errors).toHaveLength(0);
  });

  it('check bad configuration with missing: minimumRiskScore', () => {
    const exposureConfig1: any = {
      attenuationDurationThresholds: [50, 70],
      attenuationLevelValues: [0, 0, 2, 2, 2, 2, 2, 2],
      attenuationWeight: 50,
      daysSinceLastExposureLevelValues: [0, 1, 1, 1, 1, 1, 1, 1],
      daysSinceLastExposureWeight: 50,
      durationLevelValues: [0, 0, 0, 0, 5, 5, 5, 5],
      durationWeight: 50,
      transmissionRiskLevelValues: [1, 1, 1, 1, 1, 1, 1, 1],
      transmissionRiskWeight: 50,
    };

    function validateMissingMinimumRiskScore() {
      new ExposureConfigurationValidator().validateExposureConfiguration(exposureConfig1, exposureConfigurationSchema);
    }

    expect(validateMissingMinimumRiskScore).toThrow(
      new ExposureConfigurationValidationError(
        'Invalid Exposure Configuration JSON. instance requires property "minimumRiskScore"',
      ),
    );
  });
});
