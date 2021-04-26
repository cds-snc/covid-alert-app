/* eslint-disable import/namespace */
import crypto from 'crypto';

import nacl from 'tweetnacl';

import * as envs from '../../../env';
import {ContagiousDateInfo, ContagiousDateType} from '../../../shared/DataSharing';
import * as DateFns from '../../../shared/date-fns';
import {blobFetch} from '../../../shared/fetch';
import {captureMessage} from '../../../shared/log';
import JsonSchemaValidator from '../../../shared/JsonSchemaValidator';
import {getRandomBytes, downloadDiagnosisKeysFile} from '../../../bridge/CovidShield';
import {TemporaryExposureKey} from '../../../bridge/ExposureNotification';
import {BackendService} from '../BackendService';
import {covidshield} from '../covidshield';
import {StorageService, StorageDirectory} from '../../StorageService';

jest.mock('tweetnacl', () => ({
  __esModule: true,
  default: {
    box: jest.fn(),
    setPRNG: jest.fn(),
  },
}));

jest.mock('../covidshield', () => ({
  covidshield: {
    Upload: {
      create: jest.fn(),
      encode: () => ({
        finish: jest.fn(() => new Uint8Array(54)),
      }),
    },
    TemporaryExposureKey: {
      create: jest.fn(),
    },
    EncryptedUploadRequest: {
      encode: () => ({
        finish: jest.fn(),
      }),
    },
    EncryptedUploadResponse: {
      decode: jest.fn(),
    },
    KeyClaimRequest: {
      create: jest.fn(),
      encode: () => ({
        finish: jest.fn(),
      }),
    },

    KeyClaimResponse: {
      decode: jest.fn(),
    },
  },
}));

jest.mock('../../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(),
}));

jest.mock('../../../shared/fetch', () => ({
  blobFetch: jest.fn(),
}));

jest.mock('../../../shared/log', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

const storageService: StorageService = {
  save: jest.fn(),
  retrieve: jest.fn(),
  delete: jest.fn(),
};

/**
 * Utils for comparing jsonString
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Expect {
      toHaveLength(length: number): any;
    }
  }
}
expect.extend({
  toHaveLength(array, length) {
    const pass = Array.isArray(array) && array.length === length;
    if (!pass) {
      return {
        pass,
        message: () => `expect ${array} to have length of ${length}`,
      };
    }
    return {
      message: () => '',
      pass,
    };
  },
});

function generateRandomKeys(numberOfKeys: number) {
  const keys: TemporaryExposureKey[] = [];
  const interval = 1000 * 60 * 60 * 24;
  const today = (Math.floor(Date.now() / interval) * interval) / 1000;
  for (let i = 0; i < numberOfKeys; i++) {
    keys.push({
      keyData: crypto.randomBytes(16).toString('hex'),
      rollingPeriod: 144,
      rollingStartIntervalNumber: Math.floor((today - i * 60 * 60 * 24) / (60 * 10)),
      transmissionRiskLevel: 1,
    });
  }
  return keys;
}

describe('BackendService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    blobFetch.mockImplementation(() => Promise.resolve({buffer: new Uint8Array(0), error: false}));
  });

  describe('reportDiagnosisKeys', () => {
    it('returns last 28 keys if there is more than 28', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(30);
      await backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        keys,
        {dateType: ContagiousDateType.None, date: null},
      );

      expect(covidshield.Upload.create).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.toHaveLength(28),
        }),
      );
      keys
        .sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber)
        .splice(0, 28)
        .map(({rollingStartIntervalNumber, rollingPeriod}) => ({rollingStartIntervalNumber, rollingPeriod}))
        .forEach(value => {
          expect(covidshield.TemporaryExposureKey.create).toHaveBeenCalledWith(expect.objectContaining(value));
        });
    });

    it('throws if random generator is not available', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(20);
      const submissionKeys = {
        clientPrivateKey: 'mock',
        clientPublicKey: 'mock',
        serverPublicKey: 'mock',
      };
      getRandomBytes.mockRejectedValueOnce('I cannot randomize');

      await expect(
        backendService.reportDiagnosisKeys(submissionKeys, keys, {dateType: ContagiousDateType.None, date: null}),
      ).rejects.toThrow('I cannot randomize');
    });

    it('throws if backend returns an error', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(20);

      blobFetch.mockImplementationOnce(() => ({
        error: true,
        // decode mock will override this with error
        buffer: new Uint8Array(0),
      }));
      covidshield.EncryptedUploadResponse.decode.mockImplementationOnce(() => ({
        error: new Error('314'),
      }));

      await expect(
        backendService.reportDiagnosisKeys(
          {
            clientPrivateKey: 'mock',
            clientPublicKey: 'mock',
            serverPublicKey: 'mock',
          },
          keys,
          {dateType: ContagiousDateType.None, date: null},
        ),
      ).rejects.toThrow('314');
    });

    it('throws a code unknown error if decode does not resolve', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(20);

      blobFetch.mockImplementationOnce(() => ({
        error: true,
        // decode mock will override this with error
        buffer: new Uint8Array(0),
      }));
      covidshield.EncryptedUploadResponse.decode.mockImplementationOnce(() => false);

      await expect(
        backendService.reportDiagnosisKeys(
          {
            clientPrivateKey: 'mock',
            clientPublicKey: 'mock',
            serverPublicKey: 'mock',
          },
          keys,
          {dateType: ContagiousDateType.None, date: null},
        ),
      ).rejects.toThrow('Code Unknown');
    });

    it('returns last 3 keys if symptom onset is today, saves last  uploaded TEK start time', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(30);
      await backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        keys,
        {dateType: ContagiousDateType.SymptomOnsetDate, date: new Date()},
      );

      expect(covidshield.Upload.create).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.toHaveLength(3),
        }),
      );
      const sortedKeys = keys
        .sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber)
        .splice(0, 3)
        .map(({rollingStartIntervalNumber, rollingPeriod}) => ({rollingStartIntervalNumber, rollingPeriod}));
      sortedKeys.forEach(value => {
        expect(covidshield.TemporaryExposureKey.create).toHaveBeenCalledWith(expect.objectContaining(value));
      });

      expect(storageService.save).toHaveBeenCalledWith(
        StorageDirectory.BackendServiceLastUploadedTekStartTimeKey,
        sortedKeys[0].rollingStartIntervalNumber.toString(),
      );
    });

    it('does not upload TEKs with timestamps before the LAST_UPLOADED_TEK_START_TIME, saves new most recent time', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);
      const keys = generateRandomKeys(10);
      storageService.retrieve.mockReturnValueOnce(keys[1].rollingStartIntervalNumber.toString());

      await backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        keys,
        {dateType: ContagiousDateType.None, date: null},
      );
      expect(covidshield.Upload.create).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.toHaveLength(1),
        }),
      );

      expect(storageService.save).toHaveBeenCalledWith(
        StorageDirectory.BackendServiceLastUploadedTekStartTimeKey,
        keys[0].rollingStartIntervalNumber.toString(),
      );
    });
  });

  describe('retrieveDiagnosisKeys', () => {
    let spyDate;

    beforeEach(() => {
      spyDate = jest.spyOn(DateFns, 'getMillisSinceUTCEpoch').mockImplementation(() => 1594764739745);
    });

    afterEach(() => {
      spyDate.mockReset();
    });

    it('returns keys file for set period', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);

      await backendService.retrieveDiagnosisKeys(18457);

      expect(downloadDiagnosisKeysFile).toHaveBeenCalledWith(
        `http://localhost/retrieve/${envs.MCC_CODE}/18457/a8527b47523dca5bfe6beb8acea351c43364d49b435a1525bdb0dc7f982dba7a`,
      );
    });

    it('returns keys file for 14 days if period is 0', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);

      await backendService.retrieveDiagnosisKeys(0);

      expect(downloadDiagnosisKeysFile).toHaveBeenCalledWith(
        `http://localhost/retrieve/${envs.MCC_CODE}/00000/2fd9e1da09518cf874d1520fe676b8264ac81e2e90efaefaa3a6a8eca060e742`,
      );
    });
  });

  describe('claimOneTimeCode', () => {
    let backendService;

    beforeEach(() => {
      backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 'region');
      const bytes = new Uint8Array(34);
      nacl.box.keyPair = () => ({publicKey: bytes, secretKey: bytes});
      covidshield.KeyClaimResponse.decode.mockImplementation(() => ({
        serverPublicKey: Uint8Array.from('QUJD'),
      }));
    });

    it('returns a valid submission key set if called with valid one time code', async () => {
      const keys = await backendService.claimOneTimeCode('MYSECRETCODE');
      expect(keys).not.toBeNull();
      expect(keys.serverPublicKey).toBeDefined();
    });

    it('throws if random generator is not available', async () => {
      getRandomBytes.mockRejectedValueOnce('I cannot randomize');
      await expect(backendService.claimOneTimeCode('MYSECRETCODE')).rejects.toThrow('I cannot randomize');
    });

    it('throws if backend reports claim error', async () => {
      blobFetch.mockImplementationOnce(() => ({
        error: true,
        // decode mock will override this with error
        buffer: new Uint8Array(0),
      }));
      covidshield.KeyClaimResponse.decode.mockImplementation(() => ({error: new Error('1')}));
      await expect(backendService.claimOneTimeCode('THISWILLNOTWORK')).rejects.toThrow('1');
    });

    it('throws unknown error on OOB backend communication errors', async () => {
      blobFetch.mockImplementationOnce(() => ({
        error: true,
        // decode mock will override this with error
        buffer: new Uint8Array(0),
      }));
      covidshield.KeyClaimResponse.decode.mockImplementation(() => ({}));
      await expect(backendService.claimOneTimeCode('THISWILLNOTWORK')).rejects.toThrow('Code Unknown');
    });
  });

  describe('getExposureConfiguration', () => {
    it('retrieves configuration from backend', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 'region');

      // eslint-disable-next-line no-global-assign
      fetch = jest.fn(() => Promise.resolve({json: () => ({})}));

      await backendService.getExposureConfiguration();
      const anticipatedURL = 'http://localhost/exposure-configuration/CA.json';
      expect(fetch).toHaveBeenCalledWith(anticipatedURL, {headers: {'Cache-Control': 'no-store'}});
    });
  });

  describe('getRegionContentUrl', () => {
    const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 'region');

    it('returns REGION_JSON_URL if it is not false or undefined', () => {
      envs.REGION_JSON_URL = 'foo';
      expect(backendService.getRegionContentUrl()).toStrictEqual(envs.REGION_JSON_URL);
    });

    it('returns a composite URL if REGION_JSON_URL is undefined', () => {
      envs.REGION_JSON_URL = undefined;
      expect(backendService.getRegionContentUrl()).toStrictEqual(`http://localhost/exposure-configuration/region.json`);
    });

    it('returns a composite URL if REGION_JSON_URL is false', () => {
      envs.REGION_JSON_URL = false;
      expect(backendService.getRegionContentUrl()).toStrictEqual(`http://localhost/exposure-configuration/region.json`);
    });
  });

  describe('isValidRegionContent', () => {
    const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 'region');

    it('returns true if content.status is 200 and payload is valid', () => {
      jest.spyOn(JsonSchemaValidator.prototype, 'validateJson').mockImplementation(() => true);
      const content = {status: 200, payload: null};
      const result = backendService.isValidRegionContent(content);
      expect(result).toStrictEqual(true);
      expect(JsonSchemaValidator.prototype.validateJson).toHaveBeenCalled();
    });

    it('returns true if content.status is 304 and payload is valid', () => {
      jest.spyOn(JsonSchemaValidator.prototype, 'validateJson').mockImplementation(() => true);
      const content = {status: 304, payload: null};
      const result = backendService.isValidRegionContent(content);
      expect(result).toStrictEqual(true);
      expect(JsonSchemaValidator.prototype.validateJson).toHaveBeenCalled();
    });

    it('throws error if content.status is not 200 or 304', () => {
      const content = {status: 400, payload: null};
      expect(() => {
        backendService.isValidRegionContent(content);
      }).toThrow("Region content didn't validate");
    });

    it('throws error if content.status is valid but they payload is not', () => {
      jest
        .spyOn(JsonSchemaValidator.prototype, 'validateJson')
        .mockImplementation()
        .mockImplementationOnce(() => {
          // eslint-disable-next-line no-template-curly-in-string
          throw new Error('Invalid JSON. ${validatorResult.errors.toString()}');
        });
      const content = {status: 200, payload: null};
      expect(() => {
        backendService.isValidRegionContent(content);
        // eslint-disable-next-line no-template-curly-in-string
      }).toThrow('Invalid JSON. ${validatorResult.errors.toString()}');
    });
  });

  describe('getStoredRegionContent', () => {
    const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);

    it('returns {status: 400, payload: null} if there is not storage item', async () => {
      const result = await backendService.getStoredRegionContent();
      expect(storageService.retrieve).toHaveBeenCalledWith(StorageDirectory.BackendServiceRegionContentKey);
      expect(result).toStrictEqual({status: 400, payload: null});
    });

    it('returns {status: 200, payload: content} if there is a storage item', async () => {
      const key = 'http://localhost/exposure-configuration/region.json';
      const payload = {foo: 'bar'};
      storageService.retrieve.mockReturnValue(JSON.stringify(payload));
      const result = await backendService.getStoredRegionContent();
      expect(storageService.retrieve).toHaveBeenCalledWith(StorageDirectory.BackendServiceRegionContentKey);
      expect(result).toStrictEqual({status: 200, payload});
    });
  });

  describe('getRegionContent', () => {
    const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);

    it('returns stored content if fetch throws an error', async () => {
      // eslint-disable-next-line no-global-assign
      fetch = jest.fn().mockImplementation(() => {
        throw new Error('fetch');
      });

      const call = jest.spyOn(backendService, 'getStoredRegionContent');

      await backendService.getRegionContent();
      expect(captureMessage).toHaveBeenCalledWith('getRegionContent - fetch error', {err: 'fetch'});
      expect(backendService.getStoredRegionContent).toHaveBeenCalled();
      call.mockReset();
    });

    it('returns stored content if isValidRegionContent throws an error', async () => {
      // eslint-disable-next-line no-global-assign
      fetch = jest.fn(() => Promise.resolve({json: () => ({})}));

      const spy = jest.spyOn(backendService, 'isValidRegionContent').mockImplementation(() => {
        throw new Error('isValidRegionContent');
      });
      const call = jest.spyOn(backendService, 'getStoredRegionContent');

      await backendService.getRegionContent();
      expect(captureMessage).toHaveBeenCalledWith('getRegionContent - fetch error', {err: 'isValidRegionContent'});
      expect(backendService.getStoredRegionContent).toHaveBeenCalled();

      spy.mockReset();
      call.mockReset();
    });

    it('saves the content to storage service and returns it as {status: 200, payload}', async () => {
      const payload = {foo: 'bar'};
      // eslint-disable-next-line no-global-assign
      fetch = jest.fn(() => Promise.resolve({json: () => payload}));
      const spy = jest.spyOn(backendService, 'isValidRegionContent').mockImplementation(() => true);

      expect(await backendService.getRegionContent()).toStrictEqual({status: 200, payload});
      expect(storageService.save).toHaveBeenCalledWith(
        StorageDirectory.BackendServiceRegionContentKey,
        JSON.stringify(payload),
      );

      spy.mockReset();
    });
  });

  describe('filterNonContagiousTEKs', () => {
    const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', storageService);

    it('does not filter out TEKs if no date is provided', async () => {
      const contagiousDateInfo: ContagiousDateInfo = {
        dateType: ContagiousDateType.None,
        date: null,
      };
      const exposureKeys = generateRandomKeys(10);
      const filteredKeys = exposureKeys.filter(backendService.filterNonContagiousTEKs(contagiousDateInfo));
      expect(filteredKeys).toStrictEqual(exposureKeys);
    });

    it('filters out TEKs generated more than 2 days before symptom onset date', async () => {
      const today = new Date();
      const symptomOnsetDate = DateFns.addDays(today, -2);
      const contagiousDateInfo: ContagiousDateInfo = {
        dateType: ContagiousDateType.SymptomOnsetDate,
        date: symptomOnsetDate,
      };
      const exposureKeys = generateRandomKeys(10);
      const filteredKeys = exposureKeys.filter(backendService.filterNonContagiousTEKs(contagiousDateInfo));
      expect(filteredKeys).toHaveLength(5);
    });

    it('filters out TEKs generated more than 2 days before test date', async () => {
      const today = new Date();
      const testDate = DateFns.addDays(today, -1);
      const contagiousDateInfo: ContagiousDateInfo = {
        dateType: ContagiousDateType.TestDate,
        date: testDate,
      };
      const exposureKeys = generateRandomKeys(14);
      const filteredKeys = exposureKeys.filter(backendService.filterNonContagiousTEKs(contagiousDateInfo));
      // today + yesterday + 2 days prior = 4
      expect(filteredKeys).toHaveLength(4);
    });
  });
});
