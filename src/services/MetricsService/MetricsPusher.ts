import {METRICS_URL} from 'env';

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
    return fetch(METRICS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: this.jsonAsString,
    })
      .then(() => MetricsPusherResult.Success)
      .catch(() => MetricsPusherResult.Error);
  }
}
