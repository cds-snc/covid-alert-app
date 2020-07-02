import {TemporaryExposureKey} from '../../bridge/ExposureNotification';

import {BackendService} from './BackendService';
import {covidshield} from './covidshield';

jest.mock('tweetnacl', () => ({
  __esModule: true,
  default: {
    box: jest.fn(),
  },
}));

jest.mock('./covidshield', () => ({
  covidshield: {
    Upload: {
      create: jest.fn(),
      encode: () => ({
        finish: jest.fn(),
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
  },
}));

jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn(),
  downloadDiagnosisKeysFile: jest.fn(),
}));

jest.mock('../../shared/fetch', () => ({
  blobFetch: () => Promise.resolve([]),
}));

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
  for (let i = 0; i < numberOfKeys; i++) {
    keys.push({
      keyData: '',
      rollingPeriod: i,
      rollingStartIntervalNumber: i,
      transmissionRiskLevel: 0,
    });
  }
  return keys;
}

describe('BackendService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('reportDiagnosisKeys', () => {
    it('returns last 14 keys if there is more than 14', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 0);
      const keys = generateRandomKeys(20);

      await backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        keys,
      );

      expect(covidshield.Upload.create).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.toHaveLength(14),
        }),
      );
      keys
        .sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber)
        .splice(0, 14)
        .map(({rollingStartIntervalNumber, rollingPeriod}) => ({rollingStartIntervalNumber, rollingPeriod}))
        .forEach(value => {
          expect(covidshield.TemporaryExposureKey.create).toHaveBeenCalledWith(expect.objectContaining(value));
        });
    });
  });
});
