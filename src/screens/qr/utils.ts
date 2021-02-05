import {useEffect} from 'react';
import {Linking} from 'react-native';
import {log} from 'shared/logging/config';
import {useNavigation} from '@react-navigation/native';
import {CheckInData} from 'shared/qr';
import {getCurrentDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

interface EventURL {
  url: string;
}

export const handleOpenURL = async ({url}: EventURL): Promise<CheckInData> => {
  const [scheme, , id, name] = url.split('/');

  if (!id || !name || scheme !== 'canada.ca:') {
    throw new Error('bad URL from QR code');
  }
  const checkInData: CheckInData = {
    id,
    // temporary until we encode this string properly
    name: name.replace(/_/g, ' '),
    timestamp: getCurrentDate().getTime(),
  };
  return checkInData;
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
