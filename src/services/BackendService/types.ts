import {TemporaryExposureKey, ExposureConfiguration} from 'bridge/ExposureNotification';

export interface SubmissionKeySet {
  serverPublicKey: string;
  clientPrivateKey: string;
  clientPublicKey: string;
}

export interface BackendInterface {
  claimOneTimeCode(code: string): Promise<SubmissionKeySet>;
  reportDiagnosisKeys(submissionKeyPair: SubmissionKeySet, keys: TemporaryExposureKey[]): Promise<void>;
  retrieveDiagnosisKeysByDay(day: Date): Promise<string>;
  retrieveDiagnosisKeysByHour(Date: Date, day: number): Promise<string>;
  getExposureConfiguration(): Promise<ExposureConfiguration>;
}
