import {Platform} from 'react-native';

import {
  CalibrationConfidence,
  ExposureWindow,
  Infectiousness,
  ReportType,
  ScanInstance,
} from '../../bridge/ExposureNotification';

import {ExposureNotificationService} from './ExposureNotificationService';

jest.mock('react-native-system-setting', () => {
  return {
    addBluetoothListener: jest.fn(),
    addLocationListener: jest.fn(),
  };
});

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(),
}));

jest.mock('react-native-background-fetch', () => {
  return {
    configure: jest.fn(),
    scheduleTask: jest.fn(),
  };
});

jest.mock('react-native-permissions', () => {
  return {checkNotifications: jest.fn(), requestNotifications: jest.fn()};
});

jest.mock('../../bridge/CovidShield', () => ({
  getRandomBytes: jest.fn().mockResolvedValue(new Uint8Array(32)),
  downloadDiagnosisKeysFile: jest.fn(),
}));

jest.mock('../../bridge/ExposureCheckScheduler', () => ({
  scheduleExposureCheck: jest.fn(),
  executeExposureCheck: jest.fn(),
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

const getExposureWindow = (scanInstances: ScanInstance[], day = 0) => {
  const exposureWindow: ExposureWindow = {
    day,
    scanInstances,
    reportType: ReportType.ConfirmedClinicalDiagnosis,
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
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });
      expect(isExposed).toStrictEqual(true);
      expect(summary.attenuationDurations).toStrictEqual([4 * 300, 0, 0]);
      expect(summary.matchedKeyCount).toStrictEqual(1);
    });

    it('triggers an exposure if 20 minutes in near', async () => {
      const scanInstances = [
        getScanInstance(60, 300),
        getScanInstance(60, 300),
        getScanInstance(60, 300),
        getScanInstance(60, 300),
      ];
      const window = getExposureWindow(scanInstances);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });

      expect(isExposed).toStrictEqual(true);
      expect(summary.attenuationDurations).toStrictEqual([0, 4 * 300, 0]);
      expect(summary.matchedKeyCount).toStrictEqual(1);
    });

    it('does not trigger an exposure if 20 minutes in far', async () => {
      const scanInstances = [
        getScanInstance(70, 300),
        getScanInstance(70, 300),
        getScanInstance(70, 300),
        getScanInstance(70, 300),
      ];
      const window = getExposureWindow(scanInstances);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });

      expect(isExposed).toStrictEqual(false);
      expect(summary).toBeUndefined();
    });

    it('does not trigger an exposure if 10 minutes in immidiate', async () => {
      const scanInstances = [getScanInstance(40, 300), getScanInstance(40, 300)];
      const window = getExposureWindow(scanInstances);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });
      expect(isExposed).toStrictEqual(false);
      expect(summary).toBeUndefined();
    });

    it('does trigger an exposure if 2 different 10 minute exposures @ immidiate on same day', async () => {
      const scanInstances = [getScanInstance(40, 600)];
      const window1 = getExposureWindow(scanInstances);
      const window2 = getExposureWindow(scanInstances);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window1, window2],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });
      expect(isExposed).toStrictEqual(true);
      expect(summary.attenuationDurations).toStrictEqual([2 * 600, 0, 0]);
      expect(summary.matchedKeyCount).toStrictEqual(2);
      expect(summary.lastExposureTimestamp).toStrictEqual(0);
    });

    it('does not trigger an exposure if 2 different 10 minute exposures @ immidiate on different days', async () => {
      const scanInstances = [getScanInstance(40, 600)];
      const window1 = getExposureWindow(scanInstances, 0);
      const window2 = getExposureWindow(scanInstances, 1);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window1, window2],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });
      expect(isExposed).toStrictEqual(false);
      expect(summary).toBeUndefined();
    });

    it('returns a summary for the most recent exposure if there are more than one occurring on different days', async () => {
      const scanInstances = [getScanInstance(40, 600), getScanInstance(40, 600)];
      const window1 = getExposureWindow(scanInstances, 6);
      const window2 = getExposureWindow(scanInstances, 10);
      const window3 = getExposureWindow(scanInstances, 1);
      const [isExposed, summary] = await service.checkIfExposedV2({
        exposureWindows: [window1, window2, window3],
        attenuationDurationThresholds: [50, 62],
        minimumExposureDurationMinutes: 15,
      });
      expect(isExposed).toStrictEqual(true);
      expect(summary.matchedKeyCount).toStrictEqual(1);
      expect(summary.lastExposureTimestamp).toStrictEqual(10);
    });
  });
});
