import {getCurrentDate} from 'shared/date-fns';
import {StorageService, StorageDirectory} from 'services/StorageService';

export interface MetricsFilterStateStorage {
  markInstalledEventAsPublished(): Promise<void>;
  isInstalledEventPublished(): Promise<boolean>;

  markOnboardedEventShouldBePublished(): Promise<void>;
  shouldOnboardedEventBePublished(): Promise<boolean>;
  markOnboardedEventShouldNotBePublished(): Promise<void>;

  getBackgroundCheckEvents(): Promise<Date[]>;
  saveBackgroundCheckEvents(events: Date[]): Promise<void>;

  getLastActiveUserEventSentDate(): Promise<Date | null>;
  updateLastActiveUserSentDateToNow(): Promise<void>;
}

export class DefaultMetricsFilterStateStorage implements MetricsFilterStateStorage {
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  markInstalledEventAsPublished(): Promise<void> {
    return this.storageService.save(StorageDirectory.MetricsFilterStateStorageInstalledEventMarkerKey, 'exists');
  }

  isInstalledEventPublished(): Promise<boolean> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsFilterStateStorageInstalledEventMarkerKey)
      .then(result => Boolean(result));
  }

  markOnboardedEventShouldBePublished(): Promise<void> {
    return this.storageService.save(
      StorageDirectory.MetricsFilterStateStorageOnboardedEventMarkerKey,
      JSON.stringify(true),
    );
  }

  shouldOnboardedEventBePublished(): Promise<boolean> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsFilterStateStorageOnboardedEventMarkerKey)
      .then(result => {
        if (result) {
          return JSON.parse(result);
        } else {
          return false;
        }
      });
  }

  markOnboardedEventShouldNotBePublished(): Promise<void> {
    return this.storageService.save(
      StorageDirectory.MetricsFilterStateStorageOnboardedEventMarkerKey,
      JSON.stringify(false),
    );
  }

  getBackgroundCheckEvents(): Promise<Date[]> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsFilterStateStorageBackgroundCheckEventMarkerKey)
      .then(result => {
        if (result) {
          return result.split(',').map(timestamp => new Date(Number(timestamp)));
        } else {
          return [];
        }
      });
  }

  saveBackgroundCheckEvents(events: Date[]): Promise<void> {
    const eventsAsListOfTimestamps = events.map(event => event.getTime());
    return this.storageService.save(
      StorageDirectory.MetricsFilterStateStorageBackgroundCheckEventMarkerKey,
      eventsAsListOfTimestamps.join(','),
    );
  }

  getLastActiveUserEventSentDate(): Promise<Date | null> {
    return this.storageService
      .retrieve(StorageDirectory.MetricsFilterStateStorageActiveUserEventMarkerKey)
      .then(value => (value ? new Date(Number(value)) : null));
  }

  updateLastActiveUserSentDateToNow(): Promise<void> {
    return this.storageService.save(
      StorageDirectory.MetricsFilterStateStorageActiveUserEventMarkerKey,
      `${getCurrentDate().getTime()}`,
    );
  }
}
