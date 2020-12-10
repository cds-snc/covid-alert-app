import {Platform} from 'react-native';
import {APP_VERSION_CODE, APP_VERSION_NAME, LOGGLY_URL} from 'env';
import {transportFunctionType} from 'react-native-logs';
import AsyncStorage from '@react-native-community/async-storage';
import {getCurrentDate, minutesBetween} from 'shared/date-fns';
import {EXPOSURE_STATUS} from 'services/ExposureNotificationService';

import {getLogUUID} from '../uuid';

const logglyTransport: transportFunctionType = async (msg, level, _options) => {
  const uuid = await getLogUUID();
  const platform = Platform.OS;
  const versionCode = APP_VERSION_CODE;
  const versionName = APP_VERSION_NAME;
  let status = '';
  let minutes = '';

  // used for staging env - never production
  if (LOGGLY_URL) {
    const today = getCurrentDate();
    const exposureStatusJson = await AsyncStorage.getItem(EXPOSURE_STATUS);

    if (exposureStatusJson) {
      const exposureStatus = JSON.parse(exposureStatusJson);
      const lastCheckedTimestamp = exposureStatus.lastChecked.timestamp;
      const lastCheckedDate = new Date(lastCheckedTimestamp);
      minutes = Math.ceil(minutesBetween(lastCheckedDate, today)).toString();
      status = exposureStatus.type;
    }

    fetch(LOGGLY_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid,
        platform,
        msg,
        level,
        versionCode,
        versionName,
        currentStatus: status,
        lastCheckedMinutesAgo: minutes,
      }),
    }).catch(error => {
      console.log(error); // eslint-disable-line no-console
    });
  }
};

export {logglyTransport};
