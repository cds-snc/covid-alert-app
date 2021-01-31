import React, {useState, useEffect} from 'react';
import {Box} from 'components';
import {BarCodeScanner} from 'expo-barcode-scanner';

import {NoPermission} from './views/NoPermission';
import {NoCamera} from './views/NoCamera';
import {QRCodeScanner} from './views/QRCodeScanner';

const Content = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <NoPermission />;
  }
  if (hasPermission === false) {
    return <NoCamera />;
  }

  return <QRCodeScanner />;
};

export const QRCodeReaderScreen = () => {
  return (
    <Box flex={1} alignSelf="stretch">
      <Content />
    </Box>
  );
};
