import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, useWindowDimensions} from 'react-native';
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

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.flex}>
        <Box style={styles.toolbar}>
          <ToolbarWithClose
            closeText={i18n.translate('DataUpload.Close')}
            useWhiteText
            onClose={close}
            showBackButton
          />
        </Box>

        {orientation === 'portrait' ? (
          <Box padding="m" flex={1} flexDirection="column">
            <Box style={{...styles.scanWrapper, ...portrait.scanWrapper}}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
                style={{...StyleSheet.absoluteFillObject, ...portrait.barcodeScanner}}
              />
            </Box>

            <Box marginTop="m" style={styles.textWrap}>
              <Text variant="bodyText" accessibilityRole="header" accessibilityAutoFocus color="bodyTitleWhite">
                {i18n.translate(`QRCode.Reader.Title`)}
              </Text>
            </Box>
          </Box>
        ) : (
          <Box padding="m" flex={1} flexDirection="row">
            <Box style={{...styles.scanWrapper, ...landscape.scanWrapper}}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
                style={{...StyleSheet.absoluteFillObject, ...landscape.barcodeScanner}}
              />
            </Box>

            <Box marginLeft="m" style={styles.textWrap}>
              <Text variant="bodyText" accessibilityRole="header" accessibilityAutoFocus color="bodyTitleWhite">
                {i18n.translate(`QRCode.Reader.Title`)}
              </Text>
            </Box>
          </Box>
        )}
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
    flex: 0,
    backgroundColor: 'black',
  },
  textWrap: {
    flex: 1,
  },
  scanWrapper: {
    aspectRatio: 1,
    alignItems: 'flex-start',
    backgroundColor: '#333',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  barcodeScanner: {
    width: '104%',
    height: '133%',
    top: '-16.5%',
    left: '-2%',
  },
});

const portrait = StyleSheet.create({
  scanWrapper: {
    width: '100%',
  },
  // These magic numbers are based on a camera ratio of 4:3
  //They have no crop effect on iOS
  barcodeScanner: {
    width: '104%',
    height: '140%',
    top: '-20%',
    left: '-2%',
  },
});

const landscape = StyleSheet.create({
  scanWrapper: {
    height: '100%',
  },
  barcodeScanner: {
    width: '140%',
    height: '104%',
    left: '-20%',
    top: '-2%',
  },
});
