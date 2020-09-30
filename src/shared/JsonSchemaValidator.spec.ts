import regionSchema from '../locale/translations/regionSchema.json';
import REGION_CONTENT from '../locale/translations/region.json';

import JsonSchemaValidator, {JsonSchemaValidationError} from './JsonSchemaValidator';

describe('JsonSchemaValidator', () => {
  it('throws an exception when a bad schema is passed', async () => {
    let result;
    try {
      result = new JsonSchemaValidator().validateJson({payload: ''}, regionSchema);
    } catch (err) {
      expect(err.name).toStrictEqual(new JsonSchemaValidationError('').name);
      expect(result).toBeUndefined();
    }
  });

  it('returns schema containing Active regions', async () => {
    const result = new JsonSchemaValidator().validateJson(REGION_CONTENT, regionSchema);
    expect(result.instance).toStrictEqual(expect.objectContaining({Active: REGION_CONTENT.Active}));
  });
});
