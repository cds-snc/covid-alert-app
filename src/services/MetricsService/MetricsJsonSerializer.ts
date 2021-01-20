import {Metric} from './Metric';

export interface MetricsJsonSerializer {
  serializeToJson(metrics: Metric[]): string;
}

export class DefaultMetricsJsonSerializer implements MetricsJsonSerializer {
  private appVersion: string;
  private appOs: string;

  constructor(appVersion: string, appOs: string) {
    this.appVersion = appVersion;
    this.appOs = appOs;
  }

  serializeToJson(metrics: Metric[]): string {
    function serializeDynamicPayload(map: [string, string][]): any {
      return Array.from(map).reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[key] = value;
        return acc;
      }, {});
    }

    const jsonStructure = {
      metricstimestamp: new Date().getTime(),
      appversion: this.appVersion,
      appos: this.appOs,
      payload: metrics.map(metric => {
        return {
          ...{identifier: metric.identifier, region: metric.region, timestamp: metric.timestamp},
          ...serializeDynamicPayload(metric.payload),
        };
      }),
    };
    return JSON.stringify(jsonStructure);
  }
}
