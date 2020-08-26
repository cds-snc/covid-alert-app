import {captureException, captureMessage} from 'shared/log';
import PushNotification from 'bridge/PushNotification';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_NAME} from 'env';
import semver from 'semver';

const READ_RECEIPTS_KEY = 'NotificationReadReceipts';
const FEED_URL = 'https://api.jsonbin.io/b/5f4533fb993a2e110d361e77/8';

const checkForNotifications = async () => {
  const selectedRegion = (await AsyncStorage.getItem('Region')) || 'CA';
  const selectedLocale = (await AsyncStorage.getItem('Locale')) || 'en';
  const readReceipts = await getReadReceipts();

  // Fetch messages from api
  const messages = await fetchNotifications();
  captureMessage('Fetched Messages', messages);

  messages.forEach(async (message: any) => {
    if (!readReceipts.includes(message.id)) {
      if (
        checkRegion(message.target_regions, selectedRegion) &&
        checkVersion(message.target_version, APP_VERSION_NAME) &&
        checkDate(message.expires_at) &&
        checkMessage(message, selectedLocale)
      ) {
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

// Validate that there is a locale-specific message
const checkMessage = (message: any, locale: string) => {
  return typeof message.title[locale] === 'string' && typeof message.message[locale] === 'string';
};

// If an expiry date is provide, validate that it's in the future
const checkDate = (target: string) => {
  if (target === undefined) {
    return true;
  }

  return Date.parse(target) >= Date.now();
};

// If a version constraint is provided, check the current app version against it
const checkVersion = (target: string, current: string) => {
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
const checkRegion = (target: string[], selected: string) => {
  if (target.includes('CA') || target.includes(selected)) {
    return true;
  }

  return false;
};

// Fetch notifications from the endpoint
const fetchNotifications = async () => {
  try {
    const response = await fetch(FEED_URL);
    const json = await response.json();
    return json.messages;
  } catch (error) {
    captureException('>>>>>> Error', error);
  }
};

export const PollNotifications = {
  checkForNotifications,
  clearNotificationReceipts,
};
