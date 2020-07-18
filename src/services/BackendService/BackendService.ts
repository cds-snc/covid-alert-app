import {Buffer} from 'buffer';

import Config from 'react-native-config';
import hmac256 from 'crypto-js/hmac-sha256';
import encHex from 'crypto-js/enc-hex';
import {TemporaryExposureKey} from 'bridge/ExposureNotification';
import nacl from 'tweetnacl';
import {getRandomBytes, downloadDiagnosisKeysFile} from 'bridge/CovidShield';
import {blobFetch} from 'shared/fetch';
import {MCC_CODE} from 'env';
import {captureMessage, captureException} from 'shared/log';
import {getMillisSinceUTCEpoch} from 'shared/date-fns';

import {Observable} from '../../shared/Observable';
import {Region} from '../../shared/Region';

import {covidshield} from './covidshield';
import {BackendInterface, SubmissionKeySet} from './types';

const MAX_UPLOAD_KEYS = 14;
const FETCH_HEADERS = {headers: {'Cache-Control': 'no-store'}};
const TRANSMISSION_RISK_LEVEL = 1;

// See https://github.com/cds-snc/covid-shield-server/pull/176
const LAST_14_DAYS_PERIOD = '00000';

export class BackendService implements BackendInterface {
  retrieveUrl: string;
  submitUrl: string;
  hmacKey: string;
  region: Observable<Region | undefined> | undefined;
  configFetchTimeout: any;

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
    const timeoutSecs = Number(Config.DOWNLOAD_TIMEOUT_SECONDS);

    const abortController = new AbortController();
    const opts = Object.assign(FETCH_HEADERS, {signal: abortController.signal});

    if (timeoutSecs > 0) {
      clearTimeout(this.configFetchTimeout);
      this.configFetchTimeout = setTimeout(() => {
        abortController.abort();
      }, timeoutSecs * 1000);
    }

    return (await fetch(exposureConfigurationUrl, opts)).json();
  }

  async claimOneTimeCode(oneTimeCode: string): Promise<SubmissionKeySet> {
    let randomBytes: Buffer;
    try {
      randomBytes = await getRandomBytes(32);
    } catch (error) {
      console.error('getRandomBytes()', error);
      throw new Error(error);
    }
    nacl.setPRNG(buff => {
      buff.set(randomBytes, 0);
    });
    const keyPair = nacl.box.keyPair();

    const keyClaimResponse = await this.keyClaim(oneTimeCode, keyPair);
    if (keyClaimResponse.error) {
      throw new Error(`Code ${keyClaimResponse.error}`);
    }

    const serverPublicKey = Buffer.from(keyClaimResponse.serverPublicKey).toString('base64');
    const clientPrivateKey = Buffer.from(keyPair.secretKey).toString('base64');
    const clientPublicKey = Buffer.from(keyPair.publicKey).toString('base64');

    return {
      serverPublicKey,
      clientPrivateKey,
      clientPublicKey,
    };
  }

  async reportDiagnosisKeys(keyPair: SubmissionKeySet, _exposureKeys: TemporaryExposureKey[]) {
    // Ref https://github.com/CovidShield/mobile/issues/192
    const filteredExposureKeys = Object.values(
      _exposureKeys.sort((first, second) => second.rollingStartIntervalNumber - first.rollingStartIntervalNumber),
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
    const buffer = await blobFetch(`${this.submitUrl}/claim-key`, 'POST', body);

    return covidshield.KeyClaimResponse.decode(Buffer.from(buffer));
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
    const arrayBuffer = await blobFetch(`${this.submitUrl}/upload`, 'POST', request);
    const response = covidshield.EncryptedUploadResponse.decode(Buffer.from(arrayBuffer));
    return response;
  }
}
