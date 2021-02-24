import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text, Toolbar2} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {Icon} from 'components/Icon';

import {handleOpenURL} from '../utils';

export const QRCodeScanner = () => {
  const navigation = useNavigation();
  const {addCheckIn} = useOutbreakService();
  const [scanned, setScanned] = useState<boolean>(false);

  const i18n = useI18n();
  const handleBarCodeScanned = async (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    try {
      const checkInData = await handleOpenURL({url: data});
      setScanned(true);
      addCheckIn(checkInData);
      navigation.navigate('CheckInSuccessfulScreen', checkInData);
    } catch (error) {
      log.debug({message: `Incorrect code with type ${type} and data ${data} has been scanned!`, payload: {error}});
      navigation.navigate('InvalidQRCodeScreen');
    }
  };
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);

  return (
    <BarCodeScanner onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned} style={styles.barcodeScanner}>
      <SafeAreaView style={styles.flex}>
        <Box marginBottom="m">
          <Toolbar2 navText={i18n.translate('DataUpload.Close')} useWhiteText onIconClicked={close} />
        </Box>
        <Box style={styles.info} paddingVertical="s" paddingHorizontal="m">
          <Text variant="bodyTitle" accessibilityRole="header" color="bodyTitleWhite">
            {i18n.translate(`QRCode.Reader.Title`)}
          </Text>
          <Icon size={170} name="scan-qr-code-white-arrow" />
        </Box>
      </SafeAreaView>
    </BarCodeScanner>
  );
};

// const opacity = 'rgba(0, 0, 0, .8)';

const styles = StyleSheet.create({
  info: {
    backgroundColor: 'black',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  toolbar: {
    backgroundColor: 'black',
  },
  flex: {
    flex: 1,
  },
  barcodeScanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
