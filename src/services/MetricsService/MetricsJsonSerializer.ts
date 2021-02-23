import {Metric} from './Metric';

export interface MetricsJsonSerializer {
  serializeToJson(timestamp: number, metrics: Metric[]): string;
}

export class DefaultMetricsJsonSerializer implements MetricsJsonSerializer {
  private appVersion: string;
  private appOs: string;
  private osVersion: string;

  constructor(appVersion: string, appOs: string, osVersion: string) {
    this.appVersion = appVersion;
    this.appOs = appOs;
    this.osVersion = osVersion;
  }

  serializeToJson(timestamp: number, metrics: Metric[]): string {
    function serializeDynamicPayload(map: [string, string][]): any {
      return Array.from(map).reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[key] = value;
        return acc;
      }, {});
    }

    const jsonStructure = {
      metricstimestamp: timestamp,
      appversion: this.appVersion,
      appos: this.appOs,
      osversion: this.osVersion,
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
