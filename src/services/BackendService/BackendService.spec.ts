import nacl from 'tweetnacl';
import * as DateFns from 'shared/date-fns';

import {getRandomBytes, downloadDiagnosisKeysFile} from '../../bridge/CovidShield';
import {TemporaryExposureKey} from '../../bridge/ExposureNotification';

import {BackendService} from './BackendService';
import {covidshield} from './covidshield';


jest.mock('tweetnacl', () => ({
  __esModule: true,
  default: {
    box: jest.fn(),
    setPRNG: jest.fn(),
  }
}));


jest.mock('./covidshield', () => ({
  covidshield: {
    Upload: {
      create: jest.fn(),
      encode: () => ({
        finish: jest.fn(() => new Uint8Array(54) )
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
      decode: () => ({
        serverPublicKey: new Uint8Array(2),
      })
    }
  },
}));


jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
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

      getRandomBytes.mockRejectedValueOnce('I cannot randomize');

      expect(backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        keys,
      )).rejects.toThrow();


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
      backendService = new BackendService('http://localhost', 'https://localhost', 'mock', undefined);
      const bytes = new Uint8Array(34);
      nacl.box.keyPair = () => ({ publicKey: bytes,
                                  secretKey: bytes });
    });

    it('returns a valid submission key set if called with valid one time code', async () => {
      const keys = await backendService.claimOneTimeCode("MYSECRETCODE");
      expect(keys).not.toBeNull();
      expect(keys.serverPublicKey).toBeDefined();
    });

    it('throws if random generator is not available', () => {
      getRandomBytes.mockRejectedValueOnce('I cannot randomize');
      expect(backendService.claimOneTimeCode("MYSECRETCODE")).rejects.toThrow();
    });

    it('throws if backend reports claim error', () => {
      mockClaimResponseError.mockValueOnce('this is an error');
      expect(backendService.claimOneTimeCode("THISWILLNOTWORK")).rejects.toThrow();
    });
  });
/*
  describe('getExposureConfiguration', () => {
    it('throws on respons
  });*/
});
