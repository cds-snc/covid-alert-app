import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text, Toolbar2} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'services/OutbreakService';
import {useOrientation} from 'shared/useOrientation';

import {handleOpenURL} from '../utils';

export const QRCodeScanner = () => {
  const navigation = useNavigation();
  const {addCheckIn} = useOutbreakService();
  const {orientation} = useOrientation();
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
      <Box style={styles.top} />

      <SafeAreaView style={styles.flex}>
        <Box style={styles.boxLeft} />
        <Box style={styles.boxRight} />
        <Box marginBottom="m" style={styles.toolbar}>
          <Toolbar2 navText={i18n.translate('DataUpload.Close')} useWhiteText onIconClicked={close} showBackButton />
        </Box>

        <Box
          style={styles.info}
          paddingVertical="s"
          paddingHorizontal="m"
          height={orientation === 'landscape' ? 40 : '25%'}
        >
          <Text variant="bodyText" accessibilityRole="header" accessibilityAutoFocus color="bodyTitleWhite">
            {i18n.translate(`QRCode.Reader.Title`)}
          </Text>
        </Box>
      </SafeAreaView>
    </BarCodeScanner>
  );
};

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    height: 30,
    backgroundColor: 'black',
    width: '100%',
  },
  info: {
    backgroundColor: 'black',
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
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
  boxLeft: {
    top: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    width: '4%',
    paddingBottom: '40%',
    backgroundColor: 'black',
  },
  boxRight: {
    top: 0,
    height: '100%',
    right: 0,
    position: 'absolute',
    width: '4%',
    paddingBottom: '40%',
    backgroundColor: 'black',
  },
});
