import React, {useState, useEffect} from 'react';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Box} from 'components';
import {QRCodeScanner, NoPermission, NoCamera} from './views';

const Content = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkPermissions = async () => {
    const {status} = await BarCodeScanner.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    (async () => {
      checkPermissions();
    })();
  }, []);

  //canAskAgain
  if (hasPermission === null) {
    return <NoPermission />;
  }
  if (hasPermission === false) {
    return (
      <NoCamera
        updatePermissions={() => {
          checkPermissions();
        }}
      />
    );
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
