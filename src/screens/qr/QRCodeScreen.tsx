import React, {useState, useEffect} from 'react';
import {Box} from 'components';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {BaseHomeView} from '../home/components/BaseHomeView';

const Content = () => {
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
    Alert.alert('Error', msg, [{text: i18n.translate(`Errors.Action`)}]);
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

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
};

export const QRCodeScreen = () => {
  return (
    <BaseHomeView>
      <Box flex={1} alignItems="center" backgroundColor="mainBackground">
        <Box flex={1} paddingTop="m" paddingBottom="m" alignSelf="stretch">
          <Content />
        </Box>
      </Box>
    </BaseHomeView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
