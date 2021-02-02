import {log} from 'shared/logging/config';

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
      category: 'metrics',
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
          category: 'metrics',
          message: 'metrics server response',
          payload: json,
        });
      })
      .then(() => MetricsPusherResult.Success)
      .catch(() => MetricsPusherResult.Error);
  }
}
