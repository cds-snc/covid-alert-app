import {TemporaryExposureKey} from '../../bridge/ExposureNotification';

import {BackendService} from './BackendService';

const mockUpload = jest.fn();

jest.mock('./covidshield', () => ({
  covidshield: {
    Upload: mockUpload,
  },
}));

jest.mock('../../bridge/CovidShield', () => ({}));

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
    mockUpload.mockClear();
    mockUpload.mockReset();
  });

  describe('reportDiagnosisKeys', () => {
    it('filters duplicated rollingStartIntervalNumber', () => {
      const backendService = new BackendService('http://localhost', 'https://localhost', 'mock', 0);

      backendService.reportDiagnosisKeys(
        {
          clientPrivateKey: 'mock',
          clientPublicKey: 'mock',
          serverPublicKey: 'mock',
        },
        [
          ...generateRandomKeys(10),
          {
            keyData: '',
            rollingPeriod: 10,
            rollingStartIntervalNumber: 0,
            transmissionRiskLevel: 0,
          },
        ],
      );

      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.toHaveLength(10),
        }),
      );
    });
  });
});
