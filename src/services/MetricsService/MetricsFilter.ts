/* eslint-disable promise/no-nesting */
import {getHoursBetween, getCurrentDate, daysBetweenUTC, getUTCMidnight} from 'shared/date-fns';
import {ExposureStatus, ExposureStatusType} from 'services/ExposureNotificationService';

import {DefaultMetricsFilterStateStorage, MetricsFilterStateStorage} from './MetricsFilterStateStorage';
import {SecureKeyValueStore} from './SecureKeyValueStorage';

export enum EventTypeMetric {
  Installed = 'installed',
  Onboarded = 'onboarded',
  Exposed = 'exposed',
  OtkNoDate = 'otk-no-date',
  OtkWithDate = 'otk-with-date',
  EnToggle = 'en-toggle',
  ExposedClear = 'exposed-clear',
  BackgroundCheck = 'background-check',
  ActiveUser = 'active-user',
  BackgroundProcess = 'background-process',
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
    }
  | {
      type: EventTypeMetric.OtkNoDate;
      exposureHistory: number[];
    }
  | {
      type: EventTypeMetric.OtkWithDate;
    }
  | {
      type: EventTypeMetric.EnToggle;
      state: boolean;
      onboardedDate: Date | undefined;
    }
  | {
      type: EventTypeMetric.ExposedClear;
      exposureStatus: ExposureStatus;
    }
  | {
      type: EventTypeMetric.BackgroundCheck;
    }
  | {
      type: EventTypeMetric.ActiveUser;
    }
  | {
      type: EventTypeMetric.BackgroundProcess;
      succeeded: boolean;
      durationInSeconds: number;
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

  constructor(secureKeyValueStore: SecureKeyValueStore) {
    this.stateStorage = new DefaultMetricsFilterStateStorage(secureKeyValueStore);
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
          payload: [],
          shouldBePushedToServerRightAway: false,
        });
      case EventTypeMetric.OtkNoDate:
        if (eventWithContext.exposureHistory.length > 0) {
          return Promise.resolve({
            eventType: EventTypeMetric.OtkNoDate,
            payload: [],
            shouldBePushedToServerRightAway: false,
          });
        }
        break;
      case EventTypeMetric.OtkWithDate:
        return Promise.resolve({
          eventType: EventTypeMetric.OtkWithDate,
          payload: [],
          shouldBePushedToServerRightAway: false,
        });
      case EventTypeMetric.EnToggle:
        return this.processEnToggleEvent(eventWithContext.state, eventWithContext.onboardedDate);
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
      case EventTypeMetric.ActiveUser:
        return this.processActiveUserEvent();
      case EventTypeMetric.BackgroundProcess:
        return Promise.resolve({
          eventType: EventTypeMetric.BackgroundProcess,
          payload: [
            ['status', eventWithContext.succeeded ? 'success' : 'fail'],
            ['durationInSeconds', String(eventWithContext.durationInSeconds)],
          ],
          shouldBePushedToServerRightAway: false,
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

  private processEnToggleEvent(state: boolean, onboardedDate: Date | undefined): Promise<FilteredEvent | null> {
    function shouldPublishEnToggle(): boolean {
      if (!state) return true;
      if (onboardedDate && getHoursBetween(onboardedDate, getCurrentDate()) > 24) {
        return true;
      } else {
        return false;
      }
    }

    if (shouldPublishEnToggle()) {
      return Promise.resolve({
        eventType: EventTypeMetric.EnToggle,
        payload: [['state', String(state)]],
        shouldBePushedToServerRightAway: false,
      });
    } else {
      return Promise.resolve(null);
    }
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

  private processActiveUserEvent(): Promise<FilteredEvent | null> {
    const markAndCreateEvent = (): Promise<FilteredEvent> => {
      return this.stateStorage.updateLastActiveUserSentDateToNow().then(() => {
        return {
          eventType: EventTypeMetric.ActiveUser,
          payload: [],
          shouldBePushedToServerRightAway: false,
        };
      });
    };

    return this.stateStorage.getLastActiveUserEventSentDate().then(lastActiveUserEventSentDate => {
      if (lastActiveUserEventSentDate) {
        if (daysBetweenUTC(lastActiveUserEventSentDate, getCurrentDate()) > 0) {
          return markAndCreateEvent();
        }
      } else {
        return markAndCreateEvent();
      }

      return null;
    });
  }
}
