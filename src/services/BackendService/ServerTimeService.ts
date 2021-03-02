export interface ServerTimeService {
  getTime(): Promise<Date | null>;
}

export class DefaultServerTimeService implements ServerTimeService {
  private pingUrl: string;

  constructor(pingUrl: string) {
    this.pingUrl = pingUrl;
  }

  getTime(): Promise<Date | null> {
    return fetch(this.pingUrl)
      .then(response => {
        const rawDate = response.headers.get('date');
        if (rawDate) {
          return new Date(rawDate);
        } else {
          throw new Error('[ServerTimeServer] Unable to find `date` field in response headers');
        }
      })
      .catch(() => null);
  }
}
