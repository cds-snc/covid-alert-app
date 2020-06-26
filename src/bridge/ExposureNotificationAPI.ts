export enum RiskLevel {
  Invalid = 0,
  Lowest = 1,
  Low = 2,
  LowMedium = 3,
  Medium = 4,
  MediumHigh = 5,
  High = 6,
  VeryHigh = 7,
  Highest = 8,
}

export enum Status {
  // .Undefined is made up status to indicate js client that status hasn't been received from EN framework
  Undefined = 'undefined',
  Unknown = 'unknown',
  Active = 'active',
  Disabled = 'disabled',
  BluetoothOff = 'bluetooth_off',
  Restricted = 'restricted',
}

export interface TemporaryExposureKey {
  keyData: string;
  rollingStartIntervalNumber: number;
  rollingPeriod: number;
  transmissionRiskLevel: RiskLevel;
}

export interface ExposureSummary {
  daysSinceLastExposure: number;
  matchedKeyCount: number;
  maximumRiskScore: number;
}

export interface ExposureConfiguration {
  metadata?: object;
  minimumRiskScore: number;
  attenuationLevelValues: number[];
  attenuationWeight: number;
  daysSinceLastExposureLevelValues: number[];
  daysSinceLastExposureWeight: number;
  durationLevelValues: number[];
  durationWeight: number;
  transmissionRiskLevelValues: number[];
  transmissionRiskWeight: number;
}

export interface ExposureInformation {
  dateMillisSinceEpoch: number;
  durationMinutes: number;
  attenuationValue: number;
  transmissionRiskLevel: RiskLevel;
  totalRiskScore: number;
}

export interface ExposureNotification {
  start(): Promise<void>;
  stop(): Promise<void>;
  resetAllData(): Promise<void>;

  getStatus(): Promise<Status>;

  getTemporaryExposureKeyHistory(): Promise<TemporaryExposureKey[]>;

  detectExposure(configuration: ExposureConfiguration, diagnosisKeysURLs: string[]): Promise<ExposureSummary>;
  getExposureInformation(
    summary: ExposureSummary,
    userExplanation: string /* used only by iOS */,
  ): Promise<ExposureInformation[]>;
}
