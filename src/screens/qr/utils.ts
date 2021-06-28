import {Buffer} from 'buffer';

import {useEffect} from 'react';
import {Linking} from 'react-native';
import {log} from 'shared/logging/config';
import {useNavigation} from '@react-navigation/native';
import {CheckInData} from 'shared/qr';
import {getCurrentDate} from 'shared/date-fns';
import {useOutbreakService} from 'services/OutbreakService';
import {QR_HOST, QR_CODE_PUBLIC_KEY} from 'env';
import base64 from 'react-native-base64';
import nacl from 'tweetnacl';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';

interface EventURL {
  url: string;
}

export const base64ToUint8Array = (str: string) => {
  return new Uint8Array(Array.prototype.slice.call(Buffer.from(str, 'base64'), 0));
};

const parseData = (data: string) => {
  const _locationData = data.split('\n');

  return {
    id: _locationData[0],
    name: _locationData[1],
    address: _locationData[2],
  };
};

export const handleOpenURL = async ({url}: EventURL): Promise<CheckInData> => {
  const [scheme, , host] = url.split('/');
  if (scheme !== 'https:' || host !== QR_HOST) {
    const filteredMetricsService = FilteredMetricsService.sharedInstance();
    filteredMetricsService.addEvent({type: EventTypeMetric.Error500QrUrl});
    throw new Error('bad URL from QR code');
  }

  let [, base64Str] = url.split('#');
  try {
    if (QR_CODE_PUBLIC_KEY) {
      // verify signed QR code
      const data = nacl.sign.open(base64ToUint8Array(base64Str), base64ToUint8Array(QR_CODE_PUBLIC_KEY));

      if (!data) {
        throw new Error();
      }

      // @ts-ignore
      base64Str = base64.encodeFromByteArray(data);
    }

    const _locationData = b64DecodeUtf8(base64.decode(base64Str));

    const locationData = parseData(_locationData);

    log.debug({message: 'decoded and parsed location data', payload: {locationData}});

    const checkInData: CheckInData = {
      id: locationData.id,
      name: locationData.name,
      address: locationData.address,
      timestamp: getCurrentDate().getTime(),
    };
    return checkInData;
  } catch (error) {
    const filteredMetricsService = FilteredMetricsService.sharedInstance();
    filteredMetricsService.addEvent({
      type: EventTypeMetric.Error500QrParse,
    });
    throw new Error('Problem decoding or parsing QR hash data');
  }
};

export const useDeepLinks = () => {
  const {addCheckIn} = useOutbreakService();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const deepLink = async (url: any) => {
        try {
          const checkInData = await handleOpenURL(url);
          addCheckIn(checkInData);
          navigation.navigate('QRCodeFlow', {
            screen: 'CheckInSuccessfulScreen',
            params: checkInData,
          });
        } catch (error) {
          // noop
          log.error({error});
        }
      };

      Linking.addEventListener('url', deepLink);

      Linking.getInitialURL()
        .then(initialURL => {
          if (initialURL) {
            const urlObj = {url: initialURL};
            return deepLink(urlObj);
          }
        })
        .catch(err => log.error({category: 'debug', error: err}));
      Linking.getInitialURL();
    })();

    return function cleanUp() {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, [navigation, addCheckIn]);
};

interface GroupedCheckInData {
  date: string;
  checkIns: CheckInData;
}

export const sortedCheckInArray = (checkIns: CheckInData[]) => {
  const sortedArray: GroupedCheckInData[] = [];

  if (!checkIns.length) return [];

  const sortedCheckIn = checkIns.sort(function (first, second) {
    return second.timestamp - first.timestamp;
  });
  sortedCheckIn.map(checkIn => {
    const date = new Date(checkIn.timestamp);
    const timestampToDateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    sortedArray.push({date: timestampToDateString, checkIns: checkIn});
  });

  return combine(sortedArray);
};
const combine = (array: GroupedCheckInData[]) => {
  const groupedArray = array.reduce(function (arr: any, obj) {
    arr[obj.date] = arr[obj.date] || [];
    arr[obj.date].push(obj);
    return arr;
  }, {});
  return groupedArray;
};

const b64DecodeUtf8 = (b64str: string) => {
  // @ts-ignore
  return decodeURIComponent(
    b64str
      .split('')
      .map(function (str) {
        return `%${`00${str.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );
};
