import React, {useState, useEffect} from 'react';
import {Box, ButtonSingleLine} from 'components';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';

interface EventURL {
  url: string;
}

interface EventData {
  id: string;
  name: string;
}

const CheckinRoute = 'QRCodeScreen';

// covidalert://QRCodeScreen/id/1/location_name
const handleOpenURL = ({url}: EventURL): EventData | boolean => {
  const [, , routeName, , id, name] = url.split('/');

  if (routeName === CheckinRoute) {
    return {id, name};
  }
  return false;
};

const Content = () => {
  const navigation = useNavigation();
  const {setCheckInJSON} = useStorage();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [bounds, setBounds] = useState<any>({
    origin: {x: 66, y: 266.28570556640625},
    size: {height: 190.28573608398438, width: 191.71429443359375},
  });
  const [scanned, setScanned] = useState<boolean>(false);
  const i18n = useI18n();

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanning = (scanningResult: BarCodeScannerResult) => {
    /*
    {"x": 140.57142639160156, "y": 336.8571472167969}
    {"height": 146, "width": 148.57142639160156}
    {"x": 87.14286041259766, "y": 280.5714416503906}
    {"height": 160.5714111328125, "width": 166.28570556640625}
    */

    const {bounds} = scanningResult;
    setBounds(bounds);
    // console.log(bounds?.origin);
    // console.log(bounds?.size);
  };

  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    setScanned(true);

    const result = handleOpenURL({url: data});

    if (typeof result === 'boolean') {
      const msg = `Incorrect code with type ${type} and data ${data} has been scanned!`;
      Alert.alert('Error', msg, [{text: i18n.translate(`Errors.Action`)}]);
    } else {
      setCheckInJSON(result.id.toString());
      navigation.navigate(CheckinRoute, result);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  console.log(bounds);

  return (
    <React.Fragment key={bounds.origin.x + bounds.origin.y}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? handleBarCodeScanning : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <View
          style={{
            borderWidth: 2,
            borderRadius: 0,
            position: 'absolute',
            borderColor: '#FFF',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            padding: 10,
            ...bounds?.size,
            left: bounds?.origin?.x,
            top: bounds?.origin?.y,
          }}
        />
      </BarCodeScanner>

      {scanned && (
        <Box marginTop="xxl">
          <Box alignSelf="stretch" marginTop="xxl" marginBottom="s" paddingHorizontal="m">
            <ButtonSingleLine
              text={i18n.translate('QRCode.Back')}
              variant="thinFlatNeutralGrey"
              internalLink
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
          </Box>
          <Box alignSelf="stretch" marginTop="s" marginBottom="l" paddingHorizontal="m">
            <ButtonSingleLine
              text={i18n.translate('QRCode.ScanAgain')}
              variant="thinFlatNeutralGrey"
              onPress={() => setScanned(false)}
            />
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export const QRCodeReaderScreen = () => {
  return (
    <Box flex={1} alignSelf="stretch">
      <Content />
    </Box>
  );
};
