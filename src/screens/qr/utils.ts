
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
      id, // the token
      QR_CODE_PUBLIC_KEY, // the secret
      {
        skipValidation: false, // to skip signature and exp verification
      },
    );

    if (routeName === CheckinRoute) {
      return result.payload;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};
