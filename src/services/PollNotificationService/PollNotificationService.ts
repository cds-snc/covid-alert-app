import {captureException} from 'shared/log';
import PushNotification from 'bridge/PushNotification';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_NAME} from 'env';
import semver from 'semver';

const FEED_URL = 'https://api.jsonbin.io/b/5f4533fb993a2e110d361e77/2';

const checkForNotifications = async () => {
  const db = await getDbConnection();
  const selectedRegion = (await AsyncStorage.getItem('Region')) || 'CA';
  const selectedLocale = (await AsyncStorage.getItem('Locale')) || 'en';

  // For testing only
  clearNotificationReceipts();

  // Fetch messages from api
  const messages = await fetchNotifications();

  messages.forEach(async (message: any) => {
    // check local storage for read receipt
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM receipts where message_id = ?', [message.id], (tx, results) => {
        if (!results.rows.length) {
          // no receipt found, check display constraints
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

            // save read receipt
            tx.executeSql('INSERT INTO receipts (message_id) VALUES (?)', [message.id]);
          }
        }
      });
    });
  });
};

const clearNotificationReceipts = async () => {
  const db = await getDbConnection();
  db.executeSql('DELETE FROM receipts');
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
  const currentVersion = semver.valid(semver.coerce(current));

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

// Bootstrap the database and return a connection
const getDbConnection = async () => {
  // openDatabase will create the file if it doesn't already exist
  const db = await openDatabase({name: 'CovidAlert.db', location: 'default'});

  // Make sure the receipts table exists
  db.transaction(function(txn) {
    txn.executeSql('CREATE TABLE IF NOT EXISTS receipts(id integer primary key autoincrement, message_id text)', []);
  });

  return db;
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
