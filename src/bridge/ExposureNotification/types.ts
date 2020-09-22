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
  LocationOff = 'location_off',
  PlayServicesNotAvailable = 'play_services_not_available',
  Unauthorized = 'unauthorized',
  Authorized = 'authorized',
}

export interface TemporaryExposureKey {
  keyData: string;
  rollingStartIntervalNumber: number;
  rollingPeriod: number;
  transmissionRiskLevel: RiskLevel;
}

export interface ExposureSummary {
  attenuationDurations: number[];
  daysSinceLastExposure: number;
  lastExposureTimestamp: number;
  matchedKeyCount: number;
  maximumRiskScore: number;
}

export interface ExposureConfiguration {
  metadata?: object;
  minimumExposureDurationMinutes: number;
  attenuationDurationThresholds: number[];
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
  attenuationDurations: number[];
  transmissionRiskLevel: RiskLevel;
  totalRiskScore: number;
}

export interface ExposureNotification {
  start(): Promise<void>;
  stop(): Promise<void>;
  resetAllData(): Promise<void>;
  getStatus(): Promise<Status>;
  getTemporaryExposureKeyHistory(): Promise<TemporaryExposureKey[]>;
  detectExposure(configuration: ExposureConfiguration, diagnosisKeysURLs: string[]): Promise<ExposureSummary[]>;
  getPendingExposureSummary(): Promise<ExposureSummary[] | undefined> /* used only by Android */;
}
