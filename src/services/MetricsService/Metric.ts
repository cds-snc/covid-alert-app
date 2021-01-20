export class Metric {
  readonly timestamp: number;
  readonly identifier: string;
  readonly region: string;
  readonly payload: [string, string][];

  constructor(timestamp: number, identifier: string, region: string, payload: [string, string][]) {
    this.timestamp = timestamp;
    this.identifier = identifier;
    this.region = region;
    this.payload = payload;
  }
}
