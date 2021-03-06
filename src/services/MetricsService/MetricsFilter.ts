/* eslint-disable promise/no-nesting */
import {getHoursBetween, getCurrentDate, daysBetweenUTC, getUTCMidnight} from 'shared/date-fns';
import {ExposureStatus, ExposureStatusType} from 'services/ExposureNotificationService';
import {StorageService} from 'services/StorageService';

import {DefaultMetricsFilterStateStorage, MetricsFilterStateStorage} from './MetricsFilterStateStorage';

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkEntered = 'otk-entered-v2',
  EnToggle = 'en-toggle',
  ExposedClear = 'exposed-clear',
  BackgroundCheck = 'background-check',
  BackgroundProcess = 'background-process',
  QrCodeSuccessfullyScanned = 'qr-code-successfully-scanned',
  Error400KeysBadCert = 'error-400-keys-bad-cert',
  Error400KeysDownload = 'error-400-keys-download',
  Error500QrUrl = 'error-500-qr-url',
  Error500QrParse = 'error-500-qr-parse',
}

export type EventWithContext =
  | {
      type: EventTypeMetric.Installed;
    }
  | {
      type: EventTypeMetric.Onboarded;
    }
  | {
      type: EventTypeMetric.Exposed;
      isUserExposed: boolean;
    }
  | {
      type: EventTypeMetric.OtkEntered;
      withDate: boolean;
      isUserExposedProximity: boolean;
      isUserExposedOutbreak: boolean;
    }
  | {
      type: EventTypeMetric.EnToggle;
      state: boolean;
    }
  | {
      type: EventTypeMetric.ExposedClear;
      exposureStatus: ExposureStatus;
    }
  | {
      type: EventTypeMetric.BackgroundCheck;
    }
  | {
      type: EventTypeMetric.BackgroundProcess;
      succeeded: boolean;
      durationInSeconds: number;
    }
  | {
      type: EventTypeMetric.QrCodeSuccessfullyScanned;
    }
  | {
      type: EventTypeMetric.Error400KeysBadCert;
    }
  | {
      type: EventTypeMetric.Error400KeysDownload;
    }
  | {
      type: EventTypeMetric.Error500QrUrl;
    }
  | {
      type: EventTypeMetric.Error500QrParse;
    };

export interface FilteredEvent {
  eventType: EventTypeMetric;
  payload: [string, string][];
  shouldBePushedToServerRightAway: boolean;
}

export interface MetricsFilter {
  filterEvent(eventWithContext: EventWithContext): Promise<FilteredEvent | null>;
  getDelayedOnboardedEventIfPublishable(
    notificationStatus: string,
    frameworkenabled: string,
  ): Promise<FilteredEvent | null>;
}

export class DefaultMetricsFilter implements MetricsFilter {
  private stateStorage: MetricsFilterStateStorage;

  constructor(storageService: StorageService) {
    this.stateStorage = new DefaultMetricsFilterStateStorage(storageService);
  }

  filterEvent(eventWithContext: EventWithContext): Promise<FilteredEvent | null> {
    switch (eventWithContext.type) {
      case EventTypeMetric.Installed:
        return this.processInstalledEvent();
      case EventTypeMetric.Onboarded:
        return this.stateStorage.markOnboardedEventShouldBePublished().then(() => null);
      case EventTypeMetric.Exposed:
        return Promise.resolve({
          eventType: EventTypeMetric.Exposed,
          payload: [['isUserExposed', String(eventWithContext.isUserExposed)]],
          shouldBePushedToServerRightAway: false,
        });
      case EventTypeMetric.OtkEntered:
        return this.processOtkEnteredEvent(
          eventWithContext.withDate,
          eventWithContext.isUserExposedProximity,
          eventWithContext.isUserExposedOutbreak,
        );
      case EventTypeMetric.EnToggle:
        return Promise.resolve({
          eventType: EventTypeMetric.EnToggle,
          payload: [['state', String(eventWithContext.state)]],
          shouldBePushedToServerRightAway: false,
        });
      case EventTypeMetric.ExposedClear:
        if (eventWithContext.exposureStatus.type === ExposureStatusType.Exposed) {
          return Promise.resolve({
            eventType: EventTypeMetric.ExposedClear,
            payload: [
              [
                'hoursSinceExposureDetectedAt',
                String(getHoursBetween(getCurrentDate(), new Date(eventWithContext.exposureStatus.exposureDetectedAt))),
              ],
            ],
            shouldBePushedToServerRightAway: false,
          });
        }
        break;
      case EventTypeMetric.BackgroundCheck:
        return this.processBackgroundCheckEvent();
      case EventTypeMetric.BackgroundProcess:
        return Promise.resolve({
          eventType: EventTypeMetric.BackgroundProcess,
          payload: [
            ['status', eventWithContext.succeeded ? 'success' : 'fail'],
            ['durationInSeconds', String(eventWithContext.durationInSeconds)],
          ],
          shouldBePushedToServerRightAway: false,
        });
      case EventTypeMetric.QrCodeSuccessfullyScanned:
        return Promise.resolve({
          eventType: EventTypeMetric.QrCodeSuccessfullyScanned,
          payload: [],
          shouldBePushedToServerRightAway: true,
        });
      case EventTypeMetric.Error400KeysBadCert:
        return Promise.resolve({
          eventType: EventTypeMetric.Error400KeysBadCert,
          payload: [],
          shouldBePushedToServerRightAway: true,
        });
      case EventTypeMetric.Error400KeysDownload:
        return Promise.resolve({
          eventType: EventTypeMetric.Error400KeysDownload,
          payload: [],
          shouldBePushedToServerRightAway: true,
        });
      case EventTypeMetric.Error500QrUrl:
        return Promise.resolve({
          eventType: EventTypeMetric.Error500QrUrl,
          payload: [],
          shouldBePushedToServerRightAway: true,
        });
      case EventTypeMetric.Error500QrParse:
        return Promise.resolve({
          eventType: EventTypeMetric.Error500QrParse,
          payload: [],
          shouldBePushedToServerRightAway: true,
        });
      default:
        break;
    }

    return Promise.resolve(null);
  }

  getDelayedOnboardedEventIfPublishable(
    notificationStatus: string,
    frameworkenabled: string,
  ): Promise<FilteredEvent | null> {
    return this.stateStorage.shouldOnboardedEventBePublished().then(shouldPublish => {
      if (shouldPublish) {
        return this.stateStorage.markOnboardedEventShouldNotBePublished().then(() => {
          return {
            eventType: EventTypeMetric.Onboarded,
            payload: [
              ['pushnotification', notificationStatus],
              ['frameworkenabled', frameworkenabled],
            ],
            shouldBePushedToServerRightAway: false,
          };
        });
      } else {
        return null;
      }
    });
  }

  private processInstalledEvent(): Promise<FilteredEvent | null> {
    return this.stateStorage.isInstalledEventPublished().then(isPublished => {
      if (isPublished === false) {
        return this.stateStorage.markInstalledEventAsPublished().then(() => {
          return {eventType: EventTypeMetric.Installed, payload: [], shouldBePushedToServerRightAway: true};
        });
      } else {
        return null;
      }
    });
  }

  private processOtkEnteredEvent(
    withDate: boolean,
    isUserExposedProximity: boolean,
    isUserExposedOutbreak: boolean,
  ): Promise<FilteredEvent | null> {
    function serializeIsUserExposed(): string {
      if (!isUserExposedProximity && !isUserExposedOutbreak) {
        return '';
      } else if (isUserExposedProximity && isUserExposedOutbreak) {
        return 'proximity,outbreak';
      } else if (isUserExposedProximity) {
        return 'proximity';
      } else {
        return 'outbreak';
      }
    }

    return Promise.resolve({
      eventType: EventTypeMetric.OtkEntered,
      payload: [
        ['withDate', String(withDate)],
        ['isUserExposed', serializeIsUserExposed()],
      ],
      shouldBePushedToServerRightAway: true,
    });
  }

  private processBackgroundCheckEvent(): Promise<FilteredEvent | null> {
    const newBackgroundCheckEvent = getCurrentDate();

    return this.stateStorage.getBackgroundCheckEvents().then(events => {
      if (events.length > 0) {
        const lastBackgroundCheckEvent = events[events.length - 1];
        if (daysBetweenUTC(lastBackgroundCheckEvent, newBackgroundCheckEvent) === 0) {
          return this.stateStorage.saveBackgroundCheckEvents(events.concat(newBackgroundCheckEvent)).then(() => null);
        } else {
          return this.stateStorage.saveBackgroundCheckEvents([newBackgroundCheckEvent]).then(() => {
            return {
              eventType: EventTypeMetric.BackgroundCheck,
              payload: [
                ['count', String(events.length)],
                ['utcDay', String(getUTCMidnight(events[0]))],
              ],
              shouldBePushedToServerRightAway: false,
            };
          });
        }
      } else {
        return this.stateStorage.saveBackgroundCheckEvents([newBackgroundCheckEvent]).then(() => null);
      }
    });
  }
}
