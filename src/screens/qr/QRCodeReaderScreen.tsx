import React, {useState, useEffect} from 'react';
import {Box, ButtonSingleLine} from 'components';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {log} from '../../shared/logging/config';

interface EventURL {
  url: string;
}

interface EventData {
  id: string;
  name: string;
}

const setCheckInJSON = (id: string) => {
  log.debug({message: 'setCheckInJSON', payload: id});
};

const CheckinRoute = 'QRCodeScreen';

// covidalert://QRCodeScreen/id/1/location_name
const handleOpenURL = ({url}: EventURL): EventData | boolean => {
  const [, , routeName, , id, name] = url.split('/');
  setCheckInJSON(id.toString());
  if (routeName === CheckinRoute) {
    return {id, name};
  }
  return false;
};

const Content = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const i18n = useI18n();

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    setScanned(true);

    const result = handleOpenURL({url: data});

    if (typeof result === 'boolean') {
      const msg = `Incorrect code with type ${type} and data ${data} has been scanned!`;
      Alert.alert('Error', msg, [{text: i18n.translate(`Errors.Action`)}]);
    } else {
      // console.log('go to:', result);
      navigation.navigate(CheckinRoute, result);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
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
    </>
  );
};

export const QRCodeReaderScreen = () => {
  return (
    <Box flex={1} alignSelf="stretch">
      <Content />
    </Box>
  );
};

const opacity = 'rgba(0, 0, 0, .8)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 3,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 20,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
});
