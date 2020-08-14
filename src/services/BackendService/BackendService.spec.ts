import nacl from 'tweetnacl';
import * as DateFns from 'shared/date-fns';
import {blobFetch} from 'shared/fetch';

import {getRandomBytes, downloadDiagnosisKeysFile} from '../../bridge/CovidShield';
import {TemporaryExposureKey} from '../../bridge/ExposureNotification';

import {BackendService} from './BackendService';
import {covidshield} from './covidshield';

jest.mock('tweetnacl', () => ({
  __esModule: true,
  default: {
    box: jest.fn(),
    setPRNG: jest.fn(),
  },
}));

jest.mock('./covidshield', () => ({
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

jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(),
}));

jest.mock('../../shared/fetch', () => ({
  blobFetch: jest.fn(),
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

    blobFetch.mockImplementation(() => Promise.resolve({buffer: new Uint8Array(0), error: false}));
  });

  describe('reportDiagnosisKeys', () => {
    it('returns last 14 keys if there is more than 14', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);
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

    it('throws if random generator is not available', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);
      const keys = generateRandomKeys(20);
      const submissionKeys = {
        clientPrivateKey: 'mock',
        clientPublicKey: 'mock',
        serverPublicKey: 'mock',
      };
      getRandomBytes.mockRejectedValueOnce('I cannot randomize');

      await expect(backendService.reportDiagnosisKeys(submissionKeys, keys)).rejects.toThrow('I cannot randomize');
    });

    it('throws if backend returns an error', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);
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
        ),
      ).rejects.toThrow('314');
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
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);

      await backendService.retrieveDiagnosisKeys(18457);

      expect(downloadDiagnosisKeysFile).toHaveBeenCalledWith(
        'http://localhost/retrieve/302/18457/a8527b47523dca5bfe6beb8acea351c43364d49b435a1525bdb0dc7f982dba7a',
      );
    });

    it('returns keys file for 14 days if period is 0', async () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);

      await backendService.retrieveDiagnosisKeys(0);

      expect(downloadDiagnosisKeysFile).toHaveBeenCalledWith(
        'http://localhost/retrieve/302/00000/2fd9e1da09518cf874d1520fe676b8264ac81e2e90efaefaa3a6a8eca060e742',
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
});
