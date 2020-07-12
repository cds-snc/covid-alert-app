import {Schema, Validator, ValidatorResult} from 'jsonschema';

import {ExposureConfiguration} from '../../bridge/ExposureNotification';

export class ExposureConfigurationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExposureConfigurationValidationError';
  }
}

export class ExposureConfigurationValidator {
  validateExposureConfiguration(exposureConfiguration: ExposureConfiguration, schema: Schema): ValidatorResult {
    const validator = new Validator();
    const validatorResult = validator.validate(exposureConfiguration, schema);
    if (!validatorResult.valid) {
      console.log('invalid json');
      console.log(validatorResult.errors.toString());
      throw new ExposureConfigurationValidationError(
        `Invalid Exposure Configuration JSON. ${validatorResult.errors.toString()}`,
      );
    }
    return validatorResult;
  }
}
