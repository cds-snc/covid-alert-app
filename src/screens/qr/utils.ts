import {useEffect} from 'react';
import {Linking} from 'react-native';
import {log} from 'shared/logging/config';
import {useNavigation} from '@react-navigation/native';
import {CheckInData} from 'shared/qr';
import {getCurrentDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {QR_HOST} from 'env';
import base64 from 'react-native-base64';

interface EventURL {
  url: string;
}

export const handleOpenURL = async ({url}: EventURL): Promise<CheckInData> => {
  const [scheme, , host] = url.split('/');

  if (scheme !== 'https:' || host !== QR_HOST) {
    throw new Error('bad URL from QR code');
  }

  const [, base64Str] = url.split('#');
  try {
    const _locationData = base64.decode(base64Str);
    const locationData = JSON.parse(_locationData);
    log.debug({message: 'decoded and parsed location data', payload: {locationData}});
    const checkInData: CheckInData = {
      id: locationData.id,
      name: locationData.name,
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
