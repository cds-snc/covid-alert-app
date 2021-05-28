import React, {useCallback, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text, ToolbarWithClose} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'services/OutbreakService';
import {useOrientation} from 'shared/useOrientation';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';

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

      FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.QrCodeSuccessfullyScanned});

      log.debug({
        category: 'qr-code',
        message: 'successful scan',
        payload: {checkInData},
      });

      navigation.navigate('CheckInSuccessfulScreen', checkInData);
    } catch (error) {
      log.debug({
        category: 'qr-code',
        message: `Incorrect code with type ${type} and data ${data} has been scanned!`,
        payload: {error},
      });
      navigation.navigate('InvalidQRCodeScreen');
    }
  };
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);

  const {width} = useWindowDimensions();

  return (
    <>
      <SafeAreaView style={styles.flex}>
        <Box style={styles.toolbar}>
          <ToolbarWithClose
            closeText={i18n.translate('DataUpload.Close')}
            useWhiteText
            onClose={close}
            showBackButton
          />
        </Box>
        <Box paddingVertical="m" paddingHorizontal="m" style={{...styles.scanWrapper}}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
            style={{...styles.barcodeScanner}}
          >
            <Box style={{...styles.mask, top: orientation === 'portrait' ? width : '85%'}}>
              <Box paddingTop="m">
                <Text variant="bodyText" accessibilityRole="header" accessibilityAutoFocus color="bodyTitleWhite">
                  {i18n.translate(`QRCode.Reader.Title`)}
                </Text>
              </Box>
            </Box>
          </BarCodeScanner>
        </Box>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'flex-start',
  },
  toolbar: {
    top: 0,
    backgroundColor: 'black',
  },
  scanWrapper: {
    flex: 1,
  },
  barcodeScanner: {
    flex: 0.8,
    backgroundColor: 'transparent',
  },
  /* top:value -> for portrait is offset by width of screen */
  mask: {bottom: 0, left: 0, right: 0, position: 'absolute', backgroundColor: 'black'},
});
