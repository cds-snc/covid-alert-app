import {Platform} from 'react-native';
import {APP_VERSION_CODE, APP_VERSION_NAME, LOGGLY_URL, EN_API_VERSION} from 'env';
import {transportFunctionType} from 'react-native-logs';
import {getCurrentDate, minutesBetween} from 'shared/date-fns';
import {DefaultStorageService, StorageDirectory} from 'services/StorageService';

import {getLogUUID} from '../uuid';

const logglyTransport: transportFunctionType = async (msg, level, _options) => {
  const uuid = await getLogUUID();
  const platform = Platform.OS;
  const versionCode = APP_VERSION_CODE;
  const versionName = APP_VERSION_NAME;
  const enApiVersion = String(EN_API_VERSION) || 'not set';
  let currentStatus = '';
  let lastCheckedMinutesAgo = '';

  // used for staging env - never production
  if (LOGGLY_URL) {
    const today = getCurrentDate();
    const exposureStatusJson = await DefaultStorageService.sharedInstance().retrieve(
      StorageDirectory.ExposureNotificationServiceExposureStatusKey,
    );

    if (exposureStatusJson) {
      const exposureStatus = JSON.parse(exposureStatusJson);
      const lastCheckedTimestamp = exposureStatus.lastChecked?.timestamp;
      const lastCheckedDate = new Date(lastCheckedTimestamp);
      lastCheckedMinutesAgo = Math.ceil(minutesBetween(lastCheckedDate, today)).toString();
      currentStatus = exposureStatus.type;
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
        currentStatus,
        lastCheckedMinutesAgo,
        enApiVersion,
      }),
    }).catch(error => {
      console.log(error); // eslint-disable-line no-console
    });
  }
};

export {logglyTransport};
