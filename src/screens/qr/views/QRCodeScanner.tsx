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

  const maskProps = orientation === 'portrait' ? {top: width} : {};

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

        {orientation === 'portrait' ? (
          <Box paddingVertical="xs" paddingHorizontal="xs" style={portrait.scanWrapper}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
              style={portrait.barcodeScanner}
            >
              <Box style={{...portrait.mask, ...maskProps}}>
                <Box paddingTop="m" paddingBottom="m">
                  <Text variant="bodyText" accessibilityRole="header" accessibilityAutoFocus color="bodyTitleWhite">
                    {i18n.translate(`QRCode.Reader.Title`)}
                  </Text>
                </Box>
              </Box>
            </BarCodeScanner>
          </Box>
        ) : (
          <Box paddingVertical="xs" paddingHorizontal="xs" style={landscape.scanWrapper}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
              style={landscape.barcodeScanner}
            >
              <Box paddingVertical="xs" paddingHorizontal="xs" />
            </BarCodeScanner>

            <Box style={landscape.textWrap}>
              <Text
                variant="bodyText"
                paddingHorizontal="m"
                accessibilityRole="header"
                accessibilityAutoFocus
                color="bodyTitleWhite"
              >
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
    top: 0,
    backgroundColor: 'black',
  },
});

const portrait = StyleSheet.create({
  scanWrapper: {
    flex: 0.8,
  },
  barcodeScanner: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  /* top:value -> for portrait is offset by width of screen */
  mask: {bottom: 0, left: 0, right: 0, position: 'absolute', backgroundColor: 'black'},
});

const landscape = StyleSheet.create({
  scanWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -10,
  },
  barcodeScanner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    height: '100%',
    marginTop: -10,
  },
  textWrap: {
    flex: 1,
    marginTop: -8,
  },
});
