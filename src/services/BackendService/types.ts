import {TemporaryExposureKey, ExposureConfiguration} from 'bridge/ExposureNotification';
import {ContagiousDateInfo} from 'screens/datasharing/components';

export interface SubmissionKeySet {
  serverPublicKey: string;
  clientPrivateKey: string;
  clientPublicKey: string;
}

export interface BackendInterface {
  claimOneTimeCode(code: string): Promise<SubmissionKeySet>;
  reportDiagnosisKeys(
    submissionKeyPair: SubmissionKeySet,
    keys: TemporaryExposureKey[],
    contagiousDateInfo: ContagiousDateInfo,
  ): Promise<void>;
  retrieveDiagnosisKeys(period: number): Promise<string>;
  getExposureConfiguration(): Promise<ExposureConfiguration>;
}
