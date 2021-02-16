import {Buffer} from 'buffer';

import {useEffect} from 'react';
import {Linking} from 'react-native';
import {log} from 'shared/logging/config';
import {useNavigation} from '@react-navigation/native';
import {CheckInData} from 'shared/qr';
import {getCurrentDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {QR_HOST, QR_CODE_PUBLIC_KEY} from 'env';
import base64 from 'react-native-base64';
import nacl from 'tweetnacl';

interface EventURL {
  url: string;
}

const base64ToUint8Array = (str: string) => {
  return new Uint8Array(Array.prototype.slice.call(Buffer.from(str, 'base64'), 0));
};

export const handleOpenURL = async ({url}: EventURL): Promise<CheckInData> => {
  const [scheme, , host] = url.split('/');

  if (scheme !== 'https:' || host !== QR_HOST) {
    throw new Error('bad URL from QR code');
  }

  const [, base64Str] = url.split('#');
  try {
    let verifiedBase64 = base64Str;

    if (QR_CODE_PUBLIC_KEY) {
      // verify signed QR code
      const data = nacl.sign.open(base64ToUint8Array(base64Str), base64ToUint8Array(QR_CODE_PUBLIC_KEY));

      if (!data) {
        throw new Error();
      }

      // Note: package type definition is not up to date
      // @ts-ignore
      verifiedBase64 = base64.encodeFromByteArray(data);
    }

    const _locationData = base64.decode(verifiedBase64);
    const locationData = JSON.parse(_locationData);
    log.debug({message: 'decoded and parsed location data', payload: {locationData}});
    const checkInData: CheckInData = {
      id: locationData.id,
      name: locationData.name,
      address: locationData.address,
      timestamp: getCurrentDate().getTime(),
    };
    return checkInData;
  } catch (error) {
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
