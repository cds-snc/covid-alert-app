import {ServerTimeService} from 'services/BackendService';
import {getCurrentDate, minutesBetween} from 'shared/date-fns';
import {log} from 'shared/logging/config';

const TimeDifferenceBetweenLocalAndServerTimeRequiredToForceExposureCheckInMinutes = 30;
const InternalServerTimeCacheValidityDurationInMinutes = 5;

export interface ServerTimeBasedExposureCheckTrigger {
  shouldPerformExposureCheck(): Promise<boolean>;
}

export class DefaultServerTimeBasedExposureCheckTrigger implements ServerTimeBasedExposureCheckTrigger {
  private serverTimeService: ServerTimeService;

  private cachedServerTime?: {serverTime: Date; localDateWhenServerTimeHasBeenFetched: Date};

  constructor(serverTimeService: ServerTimeService) {
    this.serverTimeService = serverTimeService;
  }

  shouldPerformExposureCheck(): Promise<boolean> {
    return this.getServerTime().then(date => {
      if (!date) return false;

      if (
        Math.abs(minutesBetween(date, getCurrentDate())) >=
        TimeDifferenceBetweenLocalAndServerTimeRequiredToForceExposureCheckInMinutes
      ) {
        log.debug({
          category: 'exposure-check',
          message: 'shouldPerformExposureCheck',
          payload: {
            result: 'yes',
            reason: 'time difference between local and server time is too high',
            localTimeUTC: String(getCurrentDate()),
            serverTimeUTC: String(date),
          },
        });
        return true;
      } else {
        return false;
      }
    });
  }

  private getServerTime(): Promise<Date | null> {
    if (this.cachedServerTime) {
      if (
        minutesBetween(this.cachedServerTime.localDateWhenServerTimeHasBeenFetched, getCurrentDate()) >=
        InternalServerTimeCacheValidityDurationInMinutes
      ) {
        return this.fetchAndCacheServerTime();
      } else {
        return Promise.resolve(this.cachedServerTime.serverTime);
      }
    } else {
      return this.fetchAndCacheServerTime();
    }
  }

  private fetchAndCacheServerTime(): Promise<Date | null> {
    return this.serverTimeService.getTime().then(date => {
      if (date) this.cachedServerTime = {serverTime: date, localDateWhenServerTimeHasBeenFetched: getCurrentDate()};
      return date;
    });
  }
}
