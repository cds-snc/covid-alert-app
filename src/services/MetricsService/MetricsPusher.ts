import {log} from 'shared/logging/config';
import {Key} from 'services/StorageService';
import {getCurrentDate} from 'shared/date-fns';
import RNSecureKeyStore from 'react-native-secure-key-store';

export const MIN_UPLOAD_MINUTES = TEST_MODE ? 60 : 60 * 24;  // 24 hours

export enum MetricsPusherResult {
  Success,
  Error,
}

export interface MetricsPusher {
  push(jsonAsString: string): Promise<MetricsPusherResult>;
}

export class DefaultMetricsPusher implements MetricsPusher {
  private apiEndpointUrl: string;
  private apiEndpointKey: string;

  constructor(apiEndpointUrl: string, apiEndpointKey: string) {
    this.apiEndpointUrl = apiEndpointUrl;
    this.apiEndpointKey = apiEndpointKey;
  }

  push(jsonAsString: string): Promise<MetricsPusherResult> {
    log.debug({
      category: 'debug',
      message: 'sending metrics to server',
      payload: jsonAsString,
    });
    return fetch(this.apiEndpointUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': this.apiEndpointKey,
      },
      body: jsonAsString,
    })
      .then(response => response.json())
      .then(json => {
        log.debug({
          category: 'debug',
          message: 'metrics server response',
          payload: json,
        });
      })
      .then(() => RNSecureKeyStore.set(Key.MetricsLastUploadedDateTime, getCurrentDate().toString()))
      .then(() => MetricsPusherResult.Success)
      .catch(() => MetricsPusherResult.Error);
  }
}
