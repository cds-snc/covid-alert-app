/**
 * References
 * - Android: https://blog.google/documents/68/Android_Exposure_Notification_API_documentation_v1.2.pdf
 * - iOS: https://covid19-static.cdn-apple.com/applications/covid19/current/static/contact-tracing/pdf/ExposureNotification-FrameworkDocumentationv1.2.pdf
 */

import {NativeModules} from 'react-native';

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
  Unknown = 'unknown',
  Active = 'active',
  Disabled = 'disabled',
  BluetoothOff = 'bluetooth_off',
  Restricted = 'restricted',
}

export interface TemporaryExposureKey {
  keyData: string;
  rollingStartNumber: number;
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
  getExposureInformation(summary: ExposureSummary): Promise<ExposureInformation[]>;
}

export default NativeModules.ExposureNotification as ExposureNotification;
