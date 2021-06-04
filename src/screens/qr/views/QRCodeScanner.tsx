import React, {useCallback, useState, useEffect} from 'react';
import {AppState, AppStateStatus, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text, ToolbarWithClose} from 'components';
import {useI18n} from 'locale';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'services/OutbreakService';
import {useOrientation} from 'shared/useOrientation';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {useCachedStorage} from 'services/StorageService';
import {QRCodeStackParamList} from 'navigation/MainNavigator';

import {handleOpenURL} from '../utils';

type QRCodeReaderScreenProps = RouteProp<QRCodeStackParamList, 'QRCodeReaderScreen'>;

export const QRCodeScanner = () => {
  const navigation = useNavigation();
  const {addCheckIn} = useOutbreakService();
  const {orientation} = useOrientation();
  const [scanned, setScanned] = useState<boolean>(false);
  const {hasViewedQrInstructions, setHasViewedQr} = useCachedStorage();

  const route = useRoute<QRCodeReaderScreenProps>();

  const fromScreen = route.params?.fromScreen;

  const i18n = useI18n();
  const handleBarCodeScanned = async (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    try {
      const checkInData = await handleOpenURL({url: data});
      setScanned(true);
      addCheckIn(checkInData);
      // ensure hasViewedQrInstructions has been set to stop <LearnAboutQRScreen /> from showing again
      await setHasViewedQr(true);

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

  useEffect(() => {
    const onAppStateChange = async (newState: AppStateStatus) => {
      if (newState !== 'active') {
        // auto navigate to home screen to unmount Camera / Scanner
        // see: https://github.com/cds-snc/covid-alert-app/issues/1663
        navigation.navigate('Home');
      }
    };

    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, [navigation]);

  const toolBarProps =
    hasViewedQrInstructions === true && fromScreen !== 'QRCodeIntroScreen'
      ? {showBackButton: false}
      : {showBackButton: true};

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.flex}>
        <Box style={styles.toolbar}>
          <ToolbarWithClose
            closeText={i18n.translate('DataUpload.Close')}
            useWhiteText
            onClose={close}
            {...toolBarProps}
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
});

const portrait = StyleSheet.create({
  scanWrapper: {
    width: '100%',
  },
  // These magic numbers are based on a camera ratio of 16:9, and can work with thicker camera ratios without creating crop effects
  // They have no crop effect on iOS either
  barcodeScanner: {
    width: '104%',
    height: '180%',
    top: '-40%',
    left: '-2%',
  },
});

const landscape = StyleSheet.create({
  scanWrapper: {
    height: '100%',
  },
  barcodeScanner: {
    width: '180%',
    height: '104%',
    left: '-40%',
    top: '-2%',
  },
});
