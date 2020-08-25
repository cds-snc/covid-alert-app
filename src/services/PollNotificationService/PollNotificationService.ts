import {captureMessage, captureException} from 'shared/log';
import PushNotification from 'bridge/PushNotification';
import {openDatabase} from 'react-native-sqlite-storage';

const FEED_URL = 'https://api.jsonbin.io/b/5f4533fb993a2e110d361e77';

const checkForNotifications = async () => {
  const DB = await getDbConnection();
  // DB.executeSql('DELETE FROM receipts');

  captureMessage('>>>>>> Poll for notifications');
  const messages = await fetchNotifications();

  messages.forEach(async (message: any) => {
    // check local storage for existing id
    DB.transaction(function(tx) {
      tx.executeSql('SELECT * FROM receipts where message_id = ?', [message.id], (tx, results) => {
        captureMessage('>>>>>>> receipts', results.rows.item(0));

        if (!results.rows.length) {
          // check region
          // check version
          PushNotification.presentLocalNotification({
            alertTitle: message.title.en,
            alertBody: message.message.en,
          });

          tx.executeSql('INSERT INTO receipts (message_id) VALUES (?)', [message.id], (tx, results) => {
            captureMessage('>>>>>> INSERT Results :' + results.rowsAffected.toString);
          });
        }
      });
    });
  });
};

const getDbConnection = async () => {
  var db = await openDatabase({name: 'CovidAlert.db', location: 'default'});

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
