import {TemporaryExposureKey, ExposureConfiguration} from 'bridge/ExposureNotification';

import {RegionContent} from '../../shared/Region';

export interface SubmissionKeySet {
  serverPublicKey: string;
  clientPrivateKey: string;
  clientPublicKey: string;
}

export interface BackendInterface {
  claimOneTimeCode(code: string): Promise<SubmissionKeySet>;
  reportDiagnosisKeys(submissionKeyPair: SubmissionKeySet, keys: TemporaryExposureKey[]): Promise<void>;
  retrieveDiagnosisKeys(period: number): Promise<string>;
  getRegionContent(): Promise<RegionContent>;
  getExposureConfiguration(): Promise<ExposureConfiguration>;
}
