import {Platform} from 'react-native';

import {
  CalibrationConfidence,
  ExposureWindow,
  Infectiousness,
  Report,
  ScanInstance,
} from '../../bridge/ExposureNotification';

import {ExposureNotificationService} from './ExposureNotificationService';

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
}));

const server: any = {
  retrieveDiagnosisKeys: jest.fn().mockResolvedValue(null),
  getExposureConfiguration: jest.fn().mockResolvedValue({}),
  claimOneTimeCode: jest.fn(),
  reportDiagnosisKeys: jest.fn(),
};
const i18n: any = {
  translate: jest.fn().mockReturnValue('foo'),
};
const storage: any = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValueOnce(undefined),
};
const secureStorage: any = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValueOnce(undefined),
};

const getScanInstance = (typicalAttenuation = 60, seconds = 120) => {
  const scanInstance: ScanInstance = {
    typicalAttenuation,
    minAttenuation: 80,
    secondsSinceLastScan: seconds,
  };
  return scanInstance;
};

const getExposureWindow = (scanInstances: ScanInstance[]) => {
  const exposureWindow: ExposureWindow = {
    day: 0,
    scanInstances,
    reportType: Report.ConfirmedClinicalDiagnosis,
    infectiousness: Infectiousness.Standard,
    calibrationConfidence: CalibrationConfidence.Medium,
  };
  return exposureWindow;
};
const bridge: any = {
  detectExposure: jest.fn().mockResolvedValue({matchedKeyCount: 0}),
  start: jest.fn().mockResolvedValue(undefined),
  getTemporaryExposureKeyHistory: jest.fn().mockResolvedValue({}),
  getStatus: jest.fn().mockResolvedValue('active'),
  getPendingExposureSummary: jest.fn().mockResolvedValue(undefined),
};

describe('ExposureNotificationService', () => {
  let service: ExposureNotificationService;

  beforeEach(() => {
    service = new ExposureNotificationService(server, i18n, storage, secureStorage, bridge);
    Platform.OS = 'ios';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkIfExposedV2', () => {
    it('triggers an exposure if 20 minutes in immidiate', async () => {
      const scanInstances = [
        getScanInstance(40, 300),
        getScanInstance(40, 300),
        getScanInstance(40, 300),
        getScanInstance(40, 300),
      ];
      const window = getExposureWindow(scanInstances);
      expect(
        await service.checkIfExposedV2({
          exposureWindows: [window],
          attenuationDurationThresholds: [50, 62],
          minimumExposureDurationMinutes: 15,
        }),
      ).toStrictEqual(true);
    });
    it('triggers an exposure if 20 minutes in near', async () => {
      const scanInstances = [
        getScanInstance(60, 300),
        getScanInstance(60, 300),
        getScanInstance(60, 300),
        getScanInstance(60, 300),
      ];
      const window = getExposureWindow(scanInstances);
      expect(
        await service.checkIfExposedV2({
          exposureWindows: [window],
          attenuationDurationThresholds: [50, 62],
          minimumExposureDurationMinutes: 15,
        }),
      ).toStrictEqual(true);
    });
    it('does not trigger an exposure if 20 minutes in far', async () => {
      const scanInstances = [
        getScanInstance(70, 300),
        getScanInstance(70, 300),
        getScanInstance(70, 300),
        getScanInstance(70, 300),
      ];
      const window = getExposureWindow(scanInstances);
      expect(
        await service.checkIfExposedV2({
          exposureWindows: [window],
          attenuationDurationThresholds: [50, 62],
          minimumExposureDurationMinutes: 15,
        }),
      ).toStrictEqual(false);
    });
    it('does not trigger an exposure if 10 minutes in immidiate', async () => {
      const scanInstances = [getScanInstance(40, 300), getScanInstance(40, 300)];
      const window = getExposureWindow(scanInstances);
      expect(
        await service.checkIfExposedV2({
          exposureWindows: [window],
          attenuationDurationThresholds: [50, 62],
          minimumExposureDurationMinutes: 15,
        }),
      ).toStrictEqual(false);
    });
  });
});
