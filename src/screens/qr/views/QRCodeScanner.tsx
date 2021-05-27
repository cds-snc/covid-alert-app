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
      <Box style={styles.top} />
      <Box marginBottom="m" style={styles.toolbar}>
        <ToolbarWithClose closeText={i18n.translate('DataUpload.Close')} useWhiteText onClose={close} showBackButton />
      </Box>

      <SafeAreaView style={styles.flex}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
          style={{...styles.barcodeScanner, height: width}}
        >
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
        </BarCodeScanner>
      </SafeAreaView>
    </>
  );
};

/* {"bottom": 0, "left": 0, "position": "absolute", "right": 0, "top": 0} */

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 0,
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
    top: 30,
    backgroundColor: 'black',
  },
  flex: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'black',
  },
  barcodeScanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    top: 30,
  },
  boxLeft: {
    top: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    width: '2%',
    backgroundColor: 'black',
  },
  boxRight: {
    top: 0,
    height: '100%',
    right: 0,
    position: 'absolute',
    width: '2%',
    backgroundColor: 'black',
  },
});
