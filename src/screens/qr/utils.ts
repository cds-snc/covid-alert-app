import {useEffect} from 'react';
import {useStorage} from 'services/StorageService';
import {Linking} from 'react-native';
import {log} from 'shared/logging/config';
import {useNavigation} from '@react-navigation/native';
import {QR_CODE_PUBLIC_KEY} from 'env';
// @ts-ignore
import jwt from 'react-native-pure-jwt';

interface EventURL {
  url: string;
}

interface EventData {
  id: string;
}

export const CheckinRoute = 'QRCodeScreen';

export const handleOpenURL = async ({url}: EventURL): Promise<EventData | boolean> => {
  const [, , routeName, id] = url.split('/');

  try {
    // @ts-ignore
    const result = await jwt.decode(
      // the token
      id,
      QR_CODE_PUBLIC_KEY,
      {
        skipValidation: false,
      },
    );

    if (routeName === CheckinRoute) {
      return result.payload;
    }
  } catch (err) {
    //noop
    log.debug({message: 'handleOpenURL', payload: err});
  }

  return false;
};

export const useDeepLinks = () => {
  const {setCheckInJSON} = useStorage();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const deepLink = async (url: any) => {
        const result = await handleOpenURL(url);

        if (typeof result === 'boolean') {
          // noop
        } else {
          setCheckInJSON(result.id.toString());
          navigation.navigate(CheckinRoute, result);
        }
      };

      Linking.addEventListener('url', deepLink);

      Linking.getInitialURL()
        .then(initialURL => {
          if (initialURL) {
            return deepLink(initialURL);
          }
        })
        .catch(err => log.error({category: 'debug', error: err}));
      Linking.getInitialURL();
    })();

    return function cleanUp() {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, [navigation, setCheckInJSON]);
};
