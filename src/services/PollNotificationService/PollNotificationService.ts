import PushNotification from 'bridge/PushNotification';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_NAME} from 'env';
import semver from 'semver';
import {log} from 'shared/logging/config';

import {NotificationMessage} from './types';

const READ_RECEIPTS_KEY = 'NotificationReadReceipts';
const ETAG_STORAGE_KEY = 'NotificationsEtag';
const FEED_URL = 'https://abe63f9151c4.ngrok.io/api';

const checkForNotifications = async () => {
  const readReceipts = await getReadReceipts();

  // Fetch messages from api
  const messages: [NotificationMessage] | boolean | undefined = await fetchNotifications();

  if (messages && Array.isArray(messages)) {
    messages.forEach(async (message: NotificationMessage) => {
      log.debug({
        category: 'debug',
        message: 'message',
        payload: message,
      });
      if (!readReceipts.includes(message.id)) {
        const selectedRegion: string = (await AsyncStorage.getItem('Region')) || 'CA';
        const selectedLocale: string = (await AsyncStorage.getItem('Locale')) || 'en';
        if (shouldDisplayNotification(message, selectedRegion, selectedLocale)) {
          PushNotification.presentLocalNotification({
            alertTitle: message.title[selectedLocale],
            alertBody: message.message[selectedLocale],
          });

          // push message id onto readReceipts
          readReceipts.push(message.id);
        }
      }
    });

    // Save read receipts back to storage
    saveReadReceipts(readReceipts);
  }
};

const getReadReceipts = async () => {
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

const shouldDisplayNotification = (message: any, selectedRegion: any, selectedLocale: any): boolean => {
  return (
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

// If an expiry date is provide, validate that it's in the future
const checkDate = (target: string): boolean => {
  if (target === undefined) {
    return true;
  }

  return Date.parse(target) >= Date.now();
};

// If a version constraint is provided, check the current app version against it
const checkVersion = (target: string, current: string): boolean => {
  // Normalize the version string
  const currentVersion = semver.valid(semver.coerce(current)) || '';

  // If no target version provided, display to all
  if (target === undefined) {
    return true;
  }

  // Check the version constraint against current
  return semver.satisfies(currentVersion, target);
};

// Validate the region specified for display
const checkRegion = (target: string[], selected: string): boolean => {
  if (target.includes('CA') || target.includes(selected)) {
    return true;
  }

  return false;
};

// Fetch notifications from the endpoint
const fetchNotifications = async (): Promise<[NotificationMessage] | boolean> => {
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

    const response = await fetch(FEED_URL, {
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
      return false;
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
    return json.messages as [NotificationMessage];
  } catch (error) {
    log.error({
      category: 'debug',
      message: 'PollNotificationService fetchNotifications() error',
      error,
    });
    return false;
  }
};

export const PollNotifications = {
  checkForNotifications,
  clearNotificationReceipts,
};
