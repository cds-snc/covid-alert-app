import React, {useState, useEffect} from 'react';
import {Box, ButtonSingleLine} from 'components';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

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
    const msg = `Bar code with type ${type} and data ${data} has been scanned!`;
    Alert.alert('Success', msg, [{text: i18n.translate(`Errors.Action`)}]);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.flex}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <>
          <Box alignSelf="stretch" marginTop="xl" marginBottom="s" paddingHorizontal="m">
            <ButtonSingleLine
              text={i18n.translate('QRCode.Back')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
          </Box>
          <Box alignSelf="stretch" marginTop="s" marginBottom="l" paddingHorizontal="m">
            <ButtonSingleLine
              text={i18n.translate('QRCode.ScanAgain')}
              variant="bigFlatNeutralGrey"
              onPress={() => setScanned(false)}
            />
          </Box>
        </>
      )}
    </View>
  );
};

export const QRCodeScreen = () => {
  return (
    <Box flex={1} alignItems="center" backgroundColor="mainBackground">
      <Box flex={1} paddingTop="m" paddingBottom="m" alignSelf="stretch">
        <Content />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
