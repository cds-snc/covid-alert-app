import {captureMessage, captureException} from 'shared/log';
import PushNotification from 'bridge/PushNotification';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_VERSION_NAME} from 'env';

const semver = require('semver');
const FEED_URL = 'https://api.jsonbin.io/b/5f4533fb993a2e110d361e77/2';

const checkForNotifications = async () => {
  const DB = await getDbConnection();
  const SELECTED_REGION = (await AsyncStorage.getItem('Region')) || 'CA';

  // For testing only
  DB.executeSql('DELETE FROM receipts');

  // Fetch messages from api
  const messages = await fetchNotifications();

  messages.forEach(async (message: any) => {
    // check local storage for existing id
    DB.transaction(function(tx) {
      tx.executeSql('SELECT * FROM receipts where message_id = ?', [message.id], (tx, results) => {
        if (!results.rows.length) {
          // no receipt found, check display constraints
          if (
            checkRegion(message.target_regions, SELECTED_REGION) &&
            checkVersion(message.target_version, APP_VERSION_NAME) &&
            checkDate(message.expires_at)
          ) {
            PushNotification.presentLocalNotification({
              alertTitle: message.title.en,
              alertBody: message.message.en,
            });

            // save read receipt
            tx.executeSql('INSERT INTO receipts (message_id) VALUES (?)', [message.id]);
          }
        }
      });
    });
  });
};

const checkDate = (target: string) => {
  if (target === undefined) {
    return true;
  }

  return Date.parse(target) >= Date.now();
};

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

const checkRegion = (target: string[], selected: string) => {
  if (target.includes('CA') || target.includes(selected)) {
    return true;
  }

  return false;
};

const getDbConnection = async () => {
  // openDatabase will create the file if it doesn't already exist
  var db = await openDatabase({name: 'CovidAlert.db', location: 'default'});

  // Make sure the receipts table exists
  db.transaction(function(txn) {
    txn.executeSql('CREATE TABLE IF NOT EXISTS receipts(id integer primary key autoincrement, message_id text)', []);
  });

  return db;
};

const fetchNotifications = async () => {
  try {
    let response = await fetch(FEED_URL);
    let json = await response.json();
    return json.messages;
  } catch (error) {
    captureException('>>>>>> Error', error);
  }
};

export const PollNotifications = {
  checkForNotifications,
};
