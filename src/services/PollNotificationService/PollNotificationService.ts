import PushNotification from 'bridge/PushNotification';
import {APP_VERSION_NAME, NOTIFICATION_FEED_URL, TEST_MODE} from 'env';
import semver from 'semver';
import {log} from 'shared/logging/config';
import {getCurrentDate, minutesBetween} from 'shared/date-fns';
import {I18n} from 'locale';
import {DefaultFutureStorageService, StorageDirectory} from 'services/StorageService';

import {NotificationMessage} from './types';

// 24 hours
const MIN_POLL_NOTIFICATION_MINUTES = TEST_MODE ? 2 : 60 * 24;

const checkForNotifications = async (i18n: I18n) => {
  // Fetch messages from api
  const lastPollNotificationDateTime = await getLastPollNotificationDateTime();

  if (shouldPollNotifications(lastPollNotificationDateTime) === false) return;

  const messages: NotificationMessage[] = await fetchNotifications();
  if (!messages || Array.isArray(messages) === false) return;

  const readReceipts: string[] = await getReadReceipts();

  const selectedRegion: string =
    (await DefaultFutureStorageService.sharedInstance().retrieve(StorageDirectory.GlobalRegionKey)) || 'CA';
  const selectedLocale: string =
    (await DefaultFutureStorageService.sharedInstance().retrieve(StorageDirectory.GlobalLocaleKey)) || 'en';
  const messageToDisplay = messages.find(message =>
    shouldDisplayNotification(message, selectedRegion, selectedLocale, readReceipts),
  );

  if (messageToDisplay) {
    log.debug({
      category: 'debug',
      message: 'Message to display',
      payload: messageToDisplay,
    });
    PushNotification.presentLocalNotification({
      alertTitle: messageToDisplay.title[selectedLocale],
      alertBody: messageToDisplay.message[selectedLocale],
      channelName: i18n.translate('Notification.AndroidChannelName'),
    });
    readReceipts.push(messageToDisplay.id);
    await saveReadReceipts(readReceipts);
  }
  await markLastPollDateTime(getCurrentDate());
};

const getReadReceipts = async (): Promise<string[]> => {
  const readReceipts = await DefaultFutureStorageService.sharedInstance().retrieve(
    StorageDirectory.PollNotificationServiceReadReceiptsKey,
  );

  if (readReceipts) {
    return JSON.parse(readReceipts);
  }

  return [];
};

const saveReadReceipts = async (receipts: string[]) => {
  await DefaultFutureStorageService.sharedInstance().save(
    StorageDirectory.PollNotificationServiceReadReceiptsKey,
    JSON.stringify(receipts),
  );
};

const clearNotificationReceipts = async () => {
  await DefaultFutureStorageService.sharedInstance().delete(StorageDirectory.PollNotificationServiceReadReceiptsKey);
};

const shouldDisplayNotification = (
  message: NotificationMessage,
  selectedRegion: any,
  selectedLocale: any,
  readReceipts: string[],
): boolean => {
  return (
    checkReadReceipts(message.id, readReceipts) &&
    checkRegion(message.target_regions, selectedRegion) &&
    checkVersion(message.target_version, APP_VERSION_NAME) &&
    checkDate(message.expires_at) &&
    checkMessage(message, selectedLocale)
  );
};

// Validate that there is a locale-specific message
const checkMessage = (message: any, locale: string): boolean => {
  return typeof message.title[locale] === 'string' && typeof message.message[locale] === 'string';
};

const checkReadReceipts = (messageId: string, readReceipts: string[]): boolean => {
  return readReceipts.includes(messageId) === false;
};

// If an expiry date is provide, validate that it's in the future
const checkDate = (target: string): boolean => {
  return target === undefined || Date.parse(target) >= Date.now();
};

// If a version constraint is provided, check the current app version against it
const checkVersion = (target: string, current: string): boolean => {
  // Normalize the version string
  const currentVersion = semver.valid(semver.coerce(current)) || '';

  // Check the version constraint against current
  return target === undefined || semver.satisfies(currentVersion, target);
};

// Validate the region specified for display
const checkRegion = (target: string[], selected: string): boolean => {
  return target.includes('CA') || target.includes(selected);
};

// Fetch notifications from the endpoint
const fetchNotifications = async (): Promise<NotificationMessage[]> => {
  const etag = await DefaultFutureStorageService.sharedInstance().retrieve(
    StorageDirectory.PollNotificationServiceEtagStorageKey,
  );
  const headers: any = {};

  try {
    if (etag) {
      headers['If-None-Match'] = etag;
      log.debug({
        category: 'debug',
        message: 'headers',
        payload: headers,
      });
      log.debug({
        category: 'debug',
        message: 'Received etag from storage',
        payload: etag,
      });
    }
    log.debug({
      category: 'debug',
      message: 'NOTIFICATION_FEED_URL',
      payload: NOTIFICATION_FEED_URL,
    });
    const response = await fetch(NOTIFICATION_FEED_URL.toString(), {
      method: 'GET',
      headers,
    });
    log.debug({
      category: 'debug',
      message: 'fetchNotifications() response status',
      payload: {status: response.status},
    });

    if (response.status === 304) {
      log.debug({
        category: 'debug',
        message: 'No feed changes, skipping',
      });
      return [];
    }
    log.debug({
      category: 'debug',
      message: 'Feed updated',
    });
    const newEtag = response.headers.get('Etag');

    if (newEtag) {
      log.debug({
        category: 'debug',
        message: 'Storing etag',
      });
      await DefaultFutureStorageService.sharedInstance().save(
        StorageDirectory.PollNotificationServiceEtagStorageKey,
        newEtag,
      );
    }

    const json = await response.json();
    log.debug({
      category: 'debug',
      message: response.toString(),
      payload: json.messages,
    });
    return json.messages as [NotificationMessage];
  } catch (error) {
    log.error({
      category: 'debug',
      message: 'PollNotificationService fetchNotifications() error',
      error,
    });
    return [];
  }
};

const shouldPollNotifications = (lastPollNotificationDateTime: Date | null): boolean => {
  if (!lastPollNotificationDateTime) return true;

  const today = getCurrentDate();
  const minutesSinceLastPollNotification = minutesBetween(new Date(Number(lastPollNotificationDateTime)), today);

  log.debug({
    category: 'debug',
    message: `Minutes Since Last Poll Notification: ${minutesSinceLastPollNotification}, MinimumUploadMinutes: ${MIN_POLL_NOTIFICATION_MINUTES}`,
  });

  return minutesSinceLastPollNotification > MIN_POLL_NOTIFICATION_MINUTES;
};

const getLastPollNotificationDateTime = async (): Promise<Date | null> => {
  return DefaultFutureStorageService.sharedInstance()
    .retrieve(StorageDirectory.PollNotificationServiceLastPollNotificationDateTimeKey)
    .then(value => (value ? new Date(Number(value)) : null));
};

const markLastPollDateTime = async (date: Date): Promise<void> => {
  return DefaultFutureStorageService.sharedInstance().save(
    StorageDirectory.PollNotificationServiceLastPollNotificationDateTimeKey,
    `${date.getTime()}`,
  );
};

export const PollNotifications = {
  checkForNotifications,
  clearNotificationReceipts,
};
