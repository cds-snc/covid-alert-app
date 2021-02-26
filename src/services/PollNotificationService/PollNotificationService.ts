import PushNotification from 'bridge/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_VERSION_NAME, NOTIFICATION_FEED_URL, TEST_MODE} from 'env';
import semver from 'semver';
import {log} from 'shared/logging/config';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {getCurrentDate, minutesBetween} from 'shared/date-fns';
import {I18n} from 'locale';

import {NotificationMessage} from './types';

const READ_RECEIPTS_KEY = 'NotificationReadReceipts';
const ETAG_STORAGE_KEY = 'NotificationsEtag';
const LastPollNotificationDateTime = 'LastPollNotificationDateTimeKey';

// 24 hours
const MIN_POLL_NOTIFICATION_MINUTES = TEST_MODE ? 2 : 60 * 24;

const checkForNotifications = async (i18n: I18n) => {
  // Fetch messages from api
  const lastPollNotificationDateTime = await getLastPollNotificationDateTime();

  if (shouldPollNotifications(lastPollNotificationDateTime) === false) return;

  const messages: NotificationMessage[] = await fetchNotifications();
  if (!messages || Array.isArray(messages) === false) return;

  const readReceipts: string[] = await getReadReceipts();

  const selectedRegion: string = (await AsyncStorage.getItem('Region')) || 'CA';
  const selectedLocale: string = (await AsyncStorage.getItem('Locale')) || 'en';
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
  const readReceipts = await AsyncStorage.getItem(READ_RECEIPTS_KEY);

  if (readReceipts) {
    return JSON.parse(readReceipts);
  }

  return [];
};

const saveReadReceipts = async (receipts: string[]) => {
  await AsyncStorage.setItem(READ_RECEIPTS_KEY, JSON.stringify(receipts));
};

const clearNotificationReceipts = async () => {
  await AsyncStorage.removeItem(READ_RECEIPTS_KEY);
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
  const etag = await AsyncStorage.getItem(ETAG_STORAGE_KEY);
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
      await AsyncStorage.setItem(ETAG_STORAGE_KEY, newEtag);
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

const getLastPollNotificationDateTime = async (): Promise<any> => {
  return RNSecureKeyStore.get(LastPollNotificationDateTime).catch(() => null);
};

const markLastPollDateTime = async (date: Date): Promise<void> => {
  return RNSecureKeyStore.set(LastPollNotificationDateTime, `${date.getTime()}`, {
    accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  }).catch(() => null);
};

export const PollNotifications = {
  checkForNotifications,
  clearNotificationReceipts,
};
