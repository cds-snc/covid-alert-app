import React, {useState, useEffect} from 'react';
import {BarCodeScanner, PermissionResponse} from 'expo-barcode-scanner';
import {Box} from 'components';

import {QRCodeScanner, CameraPermissionDenied, RequestCameraPermission} from './views';

const Content = () => {
  const [hasPermission, setHasPermission] = useState<PermissionResponse | undefined>();

  const checkPermissions = async () => {
    const permissions = await BarCodeScanner.getPermissionsAsync();
    setHasPermission(permissions);
  };

  useEffect(() => {
    (async () => {
      checkPermissions();
    })();
  }, []);

  if (hasPermission?.canAskAgain === false) {
    return (
      <CameraPermissionDenied
        updatePermissions={() => {
          checkPermissions();
        }}
      />
    );
  }

  if (!hasPermission || hasPermission?.granted === false) {
    return (
      <RequestCameraPermission
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
