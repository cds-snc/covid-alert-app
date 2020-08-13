import {Buffer} from 'buffer';

import hmac256 from 'crypto-js/hmac-sha256';
import encHex from 'crypto-js/enc-hex';
import {TemporaryExposureKey} from 'bridge/ExposureNotification';
import nacl from 'tweetnacl';
import {getRandomBytes, downloadDiagnosisKeysFile} from 'bridge/CovidShield';
import {blobFetch} from 'shared/fetch';
import {MCC_CODE} from 'env';
import {captureMessage, captureException} from 'shared/log';
import {getMillisSinceUTCEpoch, hoursSinceEpoch} from 'shared/date-fns';

import {Observable} from '../../shared/Observable';
import {Region} from '../../shared/Region';

import {covidshield} from './covidshield';
import {BackendInterface, SubmissionKeySet} from './types';

const MAX_UPLOAD_KEYS = 14;
const FETCH_HEADERS = {headers: {'Cache-Control': 'no-store'}};
const TRANSMISSION_RISK_LEVEL = 1;

// See https://github.com/cds-snc/covid-shield-server/pull/176
const LAST_14_DAYS_PERIOD = '00000';

const CONTAGIOUS_DAYS_BEFORE_SYMPTOM_ONSET = 2;
// this is a placeholder value to be replaced with one supplied
// by the user.
const SYMPTOM_ONSET_DATE = new Date(2020, 7, 1);

export class BackendService implements BackendInterface {
  retrieveUrl: string;
  submitUrl: string;
  hmacKey: string;
  region: Observable<Region | undefined> | undefined;

  constructor(
    retrieveUrl: string,
    submitUrl: string,
    hmacKey: string,
    region: Observable<Region | undefined> | undefined,
  ) {
    this.retrieveUrl = retrieveUrl;
    this.submitUrl = submitUrl;
    this.hmacKey = hmacKey;
    this.region = region;
  }

  async retrieveDiagnosisKeys(period: number) {
    const periodStr = `${period > 0 ? period : LAST_14_DAYS_PERIOD}`;
    const message = `${MCC_CODE}:${periodStr}:${Math.floor(getMillisSinceUTCEpoch() / 1000 / 3600)}`;
    const hmac = hmac256(message, encHex.parse(this.hmacKey)).toString(encHex);
    const url = `${this.retrieveUrl}/retrieve/${MCC_CODE}/${periodStr}/${hmac}`;
    captureMessage('retrieveDiagnosisKeys', {period, url});
    return downloadDiagnosisKeysFile(url);
  }

  async getExposureConfiguration() {
    // purposely setting 'region' to the default value of `CA` regardless of what the user selected.
    // this is only for the purpose of downloading the configuration file.
    const region = 'CA';
    const exposureConfigurationUrl = `${this.retrieveUrl}/exposure-configuration/${region}.json`;
    captureMessage('getExposureConfiguration', {exposureConfigurationUrl});
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

  filterTEKs = (key: TemporaryExposureKey) => {

    /*
      This function filters out TEKs that were generated outside the window
      when the user was contagious.

      rollingStartIntervalNumber = A number describing when a key starts. It is equal to startTimeOfKeySinceEpochInSecs / (60 * 10).

      rollingPeriod = A number describing how long a key is valid. It is expressed in increments of 10 minutes (e.g. 144 for 24 hours).

      source: https://developers.google.com/android/reference/com/google/android/gms/nearby/exposurenotification/TemporaryExposureKey
    */
    const symptomOnsetHoursSinceEpoch = hoursSinceEpoch(SYMPTOM_ONSET_DATE);
    const contagiousStartHoursSinceEpoch = symptomOnsetHoursSinceEpoch - CONTAGIOUS_DAYS_BEFORE_SYMPTOM_ONSET * 24;

    const rollingEndIntervalNumber = key.rollingStartIntervalNumber + key.rollingPeriod;
    const rollingEndIntervalHoursSinceEpoch = rollingEndIntervalNumber / 6;
    if (rollingEndIntervalHoursSinceEpoch < contagiousStartHoursSinceEpoch) {
      // the TEK is outside the contagious period
      return false;
    }
    return true;
  };

  async reportDiagnosisKeys(keyPair: SubmissionKeySet, _exposureKeys: TemporaryExposureKey[]) {
    // Ref https://github.com/CovidShield/mobile/issues/192
    const filteredExposureKeys = Object.values(
      _exposureKeys
        .filter(this.filterTEKs)
        .sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber),
    );
    const exposureKeys = filteredExposureKeys.slice(0, MAX_UPLOAD_KEYS);
    captureMessage('reportDiagnosisKeys', {
      keyPair,
      _exposureKeys,
      exposureKeys,
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

    captureMessage('Uploading encrypted diagnosis keys');
    await this.upload(encryptedPayload, nonce, serverPublicKey, clientPublicKey);
  }

  private async keyClaim(code: string, keyPair: nacl.BoxKeyPair): Promise<covidshield.KeyClaimResponse> {
    captureMessage('keyClaim', {code});
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
