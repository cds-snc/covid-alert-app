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

export enum ReportType {
  Unknown = 0,
  ConfirmedTest = 1,
  ConfirmedClinicalDiagnosis = 2,
  SelfReport = 3,
  Recursive = 4,
  Revoked = 5,
}

export enum Infectiousness {
  None = 0,
  Standard = 1,
  High = 2,
}

export enum CalibrationConfidence {
  Lowest = 0,
  Low = 1,
  Medium = 2,
  High = 3,
}

export interface TemporaryExposureKey {
  keyData: string;
  rollingStartIntervalNumber: number;
  rollingPeriod: number;
  transmissionRiskLevel: RiskLevel;
  daysSinceOnsetOfSymptoms?: number;
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
  activate(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): Promise<Status>;
  getTemporaryExposureKeyHistory(): Promise<TemporaryExposureKey[]>;
  detectExposure(configuration: ExposureConfiguration, diagnosisKeysURLs: string[]): Promise<ExposureSummary[]>;
  getPendingExposureSummary(): Promise<ExposureSummary[] | undefined> /* used only by Android */;
  provideDiagnosisKeys(diagnosisKeysURLs: string[]): Promise<undefined>;
  getExposureWindows(): ExposureWindow[];
  getExposureWindowsIos(summary: ExposureSummary): Promise<ExposureWindow[]>;
  getExposureWindowsAndroid(diagnosisKeysURLs: string[]): Promise<ExposureWindow[]>;
}

export interface ExposureNotificationAPI {
  detectExposure(configuration: ExposureConfiguration, diagnosisKeysURLs: string[]): Promise<ExposureSummary>;
  getPendingExposureSummary(): Promise<ExposureSummary | undefined> /* used only by Android */;
  provideDiagnosisKeys(diagnosisKeysURLs: string[]): Promise<undefined> /* used only by Android */;
  getExposureWindows(): Promise<ExposureWindow[]>;
  getExposureWindowsFromSummary(summary: ExposureSummary): Promise<ExposureWindow[]>;
}

export interface ExposureWindow {
  day: number;
  scanInstances: ScanInstance[];
  reportType: ReportType;
  infectiousness: Infectiousness;
  calibrationConfidence: CalibrationConfidence;
}

export interface ScanInstance {
  typicalAttenuation: number;
  minAttenuation: number;
  secondsSinceLastScan: number;
}
