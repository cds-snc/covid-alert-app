import {ExposureNotification, Status, ExposureSummary} from 'bridge/ExposureNotification';

export class MockExposureNotification implements ExposureNotification {
  private status: Status = Status.Active;
  private exposureSummary: ExposureSummary = {
    daysSinceLastExposure: 0,
    lastExposureTimestamp: 0,
    matchedKeyCount: 0,
    maximumRiskScore: 0,
    attenuationDurations: [0, 0, 0],
  };

  start = async () => {};
  stop = async () => {};
  resetAllData = async () => {};

  getStatus = async () => this.status;

  getTemporaryExposureKeyHistory = async () => [];

  detectExposure = async () => [this.exposureSummary];

  // mock
  setStatus = (status: Status) => {
    this.status = status;
  };

  setExposureSummary = (exposureSummary: ExposureSummary) => {
    this.exposureSummary = exposureSummary;
  };

  getPendingExposureSummary = async () => undefined;
}
