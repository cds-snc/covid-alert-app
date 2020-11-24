import {Platform} from 'react-native';
import {LOGGLY_URL} from 'env';
import {transportFunctionType} from 'react-native-logs';

import {getLogUUID} from '../uuid';

const logglyTransport: transportFunctionType = async (msg, level, _options) => {
  const uuid = await getLogUUID();
  const platform = Platform.OS;

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
      }),
    }).catch(error => {
      console.log(error); // eslint-disable-line no-console
    });
  }
};

export {logglyTransport};
