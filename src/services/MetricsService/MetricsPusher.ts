import {METRICS_URL} from 'env';
import {log} from 'shared/logging/config';
import {Key} from 'services/StorageService';
import {getCurrentDate} from 'shared/date-fns';
import RNSecureKeyStore from 'react-native-secure-key-store';

export const MIN_UPLOAD_MINUTES = 60 * 24;  // 24 hours

export enum MetricsPusherResult {
  Success,
  Error,
}

export interface MetricsPusher {
  push(): Promise<MetricsPusherResult>;
}

export class DefaultMetricsPusher implements MetricsPusher {
  private jsonAsString: string;

  constructor(jsonAsString: string) {
    this.jsonAsString = jsonAsString;
  }

  push(): Promise<MetricsPusherResult> {
    log.debug({
      category: 'debug',
      message: 'sending metrics to server',
      payload: this.jsonAsString,
    });
    return fetch(METRICS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: this.jsonAsString,
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
