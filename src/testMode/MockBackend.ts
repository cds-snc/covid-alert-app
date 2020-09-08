import {TemporaryExposureKey} from 'bridge/ExposureNotification';
import {BackendInterface, SubmissionKeySet} from 'services/BackendService';
import REGION_CONTENT from 'locale/translations/region.json';

import {RegionContent, RegionContentResponse} from '../shared/Region';

const DefaultConfiguration = {
  attenuationDurationThresholds: [50, 63],
  minimumExposureDurationMinutes: 15,
  minimumRiskScore: 0,
  attenuationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
  attenuationWeight: 50,
  daysSinceLastExposureLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
  daysSinceLastExposureWeight: 50,
  durationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
  durationWeight: 50,
  transmissionRiskLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
  transmissionRiskWeight: 50,
};

class MockBackend implements BackendInterface {
  claimOneTimeCodeResponse = false;

  claimOneTimeCode = async (_code: string) => {
    if (!this.claimOneTimeCodeResponse) {
      throw new Error('Invalid code');
    }
    return {
      clientPrivateKey: 'clientPrivateKey',
      clientPublicKey: 'clientPublicKey',
      serverPublicKey: 'serverPublicKey',
    };
  };

  reportDiagnosisKeys = async (_submissionKeyPair: SubmissionKeySet, _keys: TemporaryExposureKey[]) => {};

  retrieveDiagnosisKeys = async (_period: number) => {
    return '';
  };

  getRegionContent = async (): Promise<RegionContentResponse> => {
    return {status: 200, payload: REGION_CONTENT as RegionContent};
  };

  getExposureConfiguration = async () => {
    return DefaultConfiguration;
  };
}

export default MockBackend;
