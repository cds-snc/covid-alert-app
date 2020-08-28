import {Schema, Validator, ValidatorResult} from 'jsonschema';
import {captureException} from 'shared/log';

export class JsonSchemaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonValidationError';
  }
}

export default class JsonSchemaValidator {
  validateJson(json: any, schema: Schema): ValidatorResult {
    const validator = new Validator();
    const validatorResult = validator.validate(json, schema);
    if (!validatorResult.valid) {
      captureException('invalid json', null);
      throw new JsonSchemaValidationError(`Invalid JSON. ${validatorResult.errors.toString()}`);
    }
    return validatorResult;
  }
}
