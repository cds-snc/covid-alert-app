import {Buffer} from 'buffer';

import hmac256 from 'crypto-js/hmac-sha256';
import encHex from 'crypto-js/enc-hex';
import {ExposureConfiguration, TemporaryExposureKey} from 'bridge/ExposureNotification';
import nacl from 'tweetnacl';
import {getRandomBytes, downloadDiagnosisKeysFile} from 'bridge/CovidShield';
import {blobFetch} from 'shared/fetch';
import {MCC_CODE, REGION_JSON_URL, EN_CONFIG_URL} from 'env';
import {captureMessage, captureException} from 'shared/log';
import {getMillisSinceUTCEpoch, hoursSinceEpoch} from 'shared/date-fns';
import {ContagiousDateInfo, ContagiousDateType} from 'shared/DataSharing';
import regionSchema from 'locale/translations/regionSchema.json';
import JsonSchemaValidator from 'shared/JsonSchemaValidator';
import {StorageService, StorageDirectory} from 'services/StorageService';
import {RegionContentResponse} from 'shared/Region';

import {log} from '../../shared/logging/config';

import {covidshield} from './covidshield';
import {BackendInterface, SubmissionKeySet} from './types';

const MAX_UPLOAD_KEYS = 28;
const FETCH_HEADERS = {headers: {'Cache-Control': 'no-store'}};
const TRANSMISSION_RISK_LEVEL = 1;
const TEN_MINUTE_PERIODS_PER_HOUR = 6;

// See https://github.com/cds-snc/covid-shield-server/pull/176
const LAST_14_DAYS_PERIOD = '00000';

const CONTAGIOUS_DAYS_BEFORE_SYMPTOM_ONSET = 2;
const CONTAGIOUS_DAYS_BEFORE_TEST_DATE = 2;

export class BackendService implements BackendInterface {
  retrieveUrl: string;
  submitUrl: string;
  hmacKey: string;

  private storageService: StorageService;

  constructor(retrieveUrl: string, submitUrl: string, hmacKey: string, storageService: StorageService) {
    this.retrieveUrl = retrieveUrl;
    this.submitUrl = submitUrl;
    this.hmacKey = hmacKey;
    this.storageService = storageService;
  }

  async retrieveDiagnosisKeys(period: number) {
    const periodStr = `${period > 0 ? period : LAST_14_DAYS_PERIOD}`;
    const message = `${MCC_CODE}:${periodStr}:${Math.floor(getMillisSinceUTCEpoch() / 1000 / 3600)}`;
    const hmac = hmac256(message, encHex.parse(this.hmacKey)).toString(encHex);
    const url = `${this.retrieveUrl}/retrieve/${MCC_CODE}/${periodStr}/${hmac}`;
    return downloadDiagnosisKeysFile(url);
  }

  getRegionContentUrl(): string {
    return REGION_JSON_URL ? REGION_JSON_URL : `${this.retrieveUrl}/exposure-configuration/region.json`;
  }

  isValidRegionContent = (content: RegionContentResponse) => {
    if (content.status === 200 || content.status === 304) {
      new JsonSchemaValidator().validateJson(content.payload, regionSchema);
      return true;
    }

    throw new Error("Region content didn't validate");
  };

  async getStoredRegionContent(): Promise<RegionContentResponse> {
    const storedRegionContent = await this.storageService.retrieve(StorageDirectory.BackendServiceRegionContentKey);
    if (storedRegionContent) {
      return {status: 200, payload: JSON.parse(storedRegionContent)};
    }
    return {status: 400, payload: null};
  }

  async getRegionContent(): Promise<RegionContentResponse> {
    try {
      // try fetching server content
      const response = await fetch(this.getRegionContentUrl(), FETCH_HEADERS);
      const payload = await response.json();
      this.isValidRegionContent({status: response.status, payload});
      await this.storageService.save(StorageDirectory.BackendServiceRegionContentKey, JSON.stringify(payload));
      return {status: 200, payload};
    } catch (err) {
      captureMessage('getRegionContent - fetch error', {err: err.message});
      return this.getStoredRegionContent();
    }
  }

  async getExposureConfiguration(): Promise<ExposureConfiguration> {
    // purposely setting 'region' to the default value of `CA` regardless of what the user selected.
    // this is only for the purpose of downloading the configuration file.
    const region = 'CA';
    const exposureConfigurationUrl = EN_CONFIG_URL
      ? EN_CONFIG_URL
      : `${this.retrieveUrl}/exposure-configuration/${region}.json`;
    log.debug({
      category: 'configuration',
      message: 'getExposureConfiguration',
      payload: exposureConfigurationUrl,
    });
    return (await fetch(exposureConfigurationUrl, FETCH_HEADERS)).json();
  }

  async claimOneTimeCode(oneTimeCode: string): Promise<SubmissionKeySet> {
    let randomBytes: Buffer;
    try {
      randomBytes = await getRandomBytes(32);
    } catch (error) {
      captureException('getRandomBytes()', error);
      throw new Error(error);
    }
    nacl.setPRNG(buff => {
      buff.set(randomBytes, 0);
    });
    const keyPair = nacl.box.keyPair();

    const keyClaimResponse = await this.keyClaim(oneTimeCode, keyPair);

    const serverPublicKey = Buffer.from(keyClaimResponse.serverPublicKey).toString('base64');
    const clientPrivateKey = Buffer.from(keyPair.secretKey).toString('base64');
    const clientPublicKey = Buffer.from(keyPair.publicKey).toString('base64');

    return {
      serverPublicKey,
      clientPrivateKey,
      clientPublicKey,
    };
  }

  filterNonContagiousTEKs = (contagiousDateInfo?: ContagiousDateInfo) => {
    return (key: TemporaryExposureKey) => {
      // This function filters out TEKs that were generated before the user was contagious.
      // rollingStartIntervalNumber = A number describing when a key starts. It is equal to
      // startTimeOfKeySinceEpochInSecs / (60 * 10).
      // rollingPeriod = A number describing how long a key is valid. It is expressed in
      // increments of 10 minutes (e.g. 144 for 24 hours).
      // source: https://developers.google.com/android/reference/com/google/android/gms/nearby/exposurenotification/TemporaryExposureKey
      if (!contagiousDateInfo || contagiousDateInfo.dateType === ContagiousDateType.None || !contagiousDateInfo.date) {
        return true;
      }
      const providedDateHoursSinceEpoch = hoursSinceEpoch(contagiousDateInfo.date);
      let contagiousStartHoursSinceEpoch;
      if (contagiousDateInfo.dateType === ContagiousDateType.SymptomOnsetDate) {
        contagiousStartHoursSinceEpoch = providedDateHoursSinceEpoch - CONTAGIOUS_DAYS_BEFORE_SYMPTOM_ONSET * 24;
      } else {
        contagiousStartHoursSinceEpoch = providedDateHoursSinceEpoch - CONTAGIOUS_DAYS_BEFORE_TEST_DATE * 24;
      }

      const rollingEndIntervalNumber = key.rollingStartIntervalNumber + key.rollingPeriod;
      const rollingEndIntervalHoursSinceEpoch = rollingEndIntervalNumber / TEN_MINUTE_PERIODS_PER_HOUR;
      if (rollingEndIntervalHoursSinceEpoch < contagiousStartHoursSinceEpoch) {
        // the TEK is before the contagious period
        return false;
      }
      return true;
    };
  };

  saveLastUploadedTekStartTime = async (uploadedTEKs: TemporaryExposureKey[]) => {
    if (uploadedTEKs.length === 0) {
      return;
    }
    const lastUploadedTekStartTime = uploadedTEKs[0].rollingStartIntervalNumber.toString();
    await this.storageService.save(
      StorageDirectory.BackendServiceLastUploadedTekStartTimeKey,
      lastUploadedTekStartTime,
    );
  };

  filterOldTEKs = async () => {
    const lastUploadedTekStartTime = Number(
      await this.storageService.retrieve(StorageDirectory.BackendServiceLastUploadedTekStartTimeKey),
    );
    return (key: TemporaryExposureKey) => {
      if (!lastUploadedTekStartTime) {
        return true;
      }
      if (key.rollingStartIntervalNumber > lastUploadedTekStartTime) {
        return true;
      }
      return false;
    };
  };

  async reportDiagnosisKeys(
    keyPair: SubmissionKeySet,
    _exposureKeys: TemporaryExposureKey[],
    contagiousDateInfo: ContagiousDateInfo,
  ) {
    captureMessage('contagiousDateInfo', {contagiousDateInfo});
    const filteredExposureKeys = Object.values(
      _exposureKeys
        .filter(this.filterNonContagiousTEKs(contagiousDateInfo))
        .filter(await this.filterOldTEKs())
        .sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber),
    );
    const exposureKeys = filteredExposureKeys.slice(0, MAX_UPLOAD_KEYS);
    captureMessage('keyPair', {keyPair});
    captureMessage('unfiltered exposureKeys', {
      unfilteredExposureKeys: _exposureKeys.map(x => {
        const y: any = {...x};
        y.startDate = new Date((x.rollingStartIntervalNumber * 1000 * 3600) / 6);
        return y;
      }),
    });
    captureMessage('filtered exposureKeys', {
      filteredExposureKeys: exposureKeys.map(x => {
        const y: any = {...x};
        y.startDate = new Date((x.rollingStartIntervalNumber * 1000 * 3600) / 6);
        return y;
      }),
    });

    const upload = covidshield.Upload.create({
      timestamp: {seconds: Math.floor(getMillisSinceUTCEpoch() / 1000)},
      keys: exposureKeys.map(key =>
        covidshield.TemporaryExposureKey.create({
          keyData: Buffer.from(key.keyData, 'base64'),
          transmissionRiskLevel: TRANSMISSION_RISK_LEVEL,
          rollingStartIntervalNumber: key.rollingStartIntervalNumber,
          rollingPeriod: key.rollingPeriod,
        }),
      ),
    });

    const serializedUpload = covidshield.Upload.encode(upload).finish();

    const clientPrivate = Buffer.from(keyPair.clientPrivateKey, 'base64');
    const serverPublicKey = Buffer.from(keyPair.serverPublicKey, 'base64');
    const clientPublicKey = Buffer.from(keyPair.clientPublicKey, 'base64');

    let nonce: Buffer;
    try {
      nonce = await getRandomBytes(24);
    } catch (error) {
      captureException('getRandomBytes', error);
      throw new Error(error);
    }
    const encryptedPayload = nacl.box(serializedUpload, nonce, serverPublicKey, clientPrivate);

    await this.upload(encryptedPayload, nonce, serverPublicKey, clientPublicKey);
    await this.saveLastUploadedTekStartTime(exposureKeys);
  }

  private async keyClaim(code: string, keyPair: nacl.BoxKeyPair): Promise<covidshield.KeyClaimResponse> {
    const uploadPayload = covidshield.KeyClaimRequest.create({
      oneTimeCode: code,
      appPublicKey: keyPair.publicKey,
    });

    const body = covidshield.KeyClaimRequest.encode(uploadPayload).finish();
    const response = await blobFetch(`${this.submitUrl}/claim-key`, 'POST', body);
    const keyClaimResponse = covidshield.KeyClaimResponse.decode(Buffer.from(response.buffer));
    if (response.error) {
      if (keyClaimResponse && keyClaimResponse.error) {
        throw keyClaimResponse.error;
      }
      throw new Error('Code Unknown');
    }
    return keyClaimResponse;
  }

  private async upload(
    payload: Uint8Array,
    nonce: Uint8Array,
    serverPublicKey: Uint8Array,
    appPublicKey: Uint8Array,
  ): Promise<covidshield.EncryptedUploadResponse> {
    const request = covidshield.EncryptedUploadRequest.encode({
      serverPublicKey,
      appPublicKey,
      nonce,
      payload,
    }).finish();
    const response = await blobFetch(`${this.submitUrl}/upload`, 'POST', request);
    const encryptedUploadResponse = covidshield.EncryptedUploadResponse.decode(Buffer.from(response.buffer));
    if (response.error) {
      if (encryptedUploadResponse && encryptedUploadResponse.error) {
        throw encryptedUploadResponse.error;
      }
      throw new Error('Code Unknown');
    }
    return encryptedUploadResponse;
  }
}
