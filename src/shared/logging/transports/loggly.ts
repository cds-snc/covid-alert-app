import {Platform} from 'react-native';
import {APP_VERSION_CODE, APP_VERSION_NAME, LOGGLY_URL} from 'env';
import {transportFunctionType} from 'react-native-logs';

import {getLogUUID} from '../uuid';

const logglyTransport: transportFunctionType = async (msg, level, _options) => {
  const uuid = await getLogUUID();
  const platform = Platform.OS;
  const versionCode = APP_VERSION_CODE;
  const versionName = APP_VERSION_NAME;

  // used for staging env - never production
  if (LOGGLY_URL) {
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
      }),
    }).catch(error => {
      console.log(error); // eslint-disable-line no-console
    });
  }
};

export {logglyTransport};
