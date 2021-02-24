import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {Icon} from 'components/Icon';

import {Toolbar} from '../components/Toolbar';
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

  return (
    <BarCodeScanner onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned} style={styles.barcodeScanner}>
      <View style={styles.layerTop} />
      <Box style={styles.back} paddingHorizontal="m" paddingBottom="xl">
        <Toolbar useWhiteText showBackButton />
      </Box>

      <View style={styles.layerCenter}>
        <View style={styles.layerLeft} />
        <View style={styles.focused} />
        <View style={styles.layerRight} />
      </View>
      <Box style={styles.info} paddingVertical="s" paddingHorizontal="m">
        <Text variant="bodyTitle" accessibilityRole="header" color="bodyTitleWhite">
          {i18n.translate(`QRCode.Reader.Title`)}
        </Text>
        <Icon size={170} name="scan-qr-code-white-arrow" />
      </Box>
    </BarCodeScanner>
  );
};

const opacity = 'rgba(0, 0, 0, .8)';

const styles = StyleSheet.create({
  info: {
    backgroundColor: 'black',
  },
  back: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  barcodeScanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  backText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 18,
  },
  container: {
    flex: 10,
    flexDirection: 'column',
  },
  layerTop: {
    flex: 0.5,
    backgroundColor: 'black',
  },
  layerCenter: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 2,
  },
  layerLeft: {
    backgroundColor: opacity,
    width: 10,
  },
  focused: {
    flex: 1,
  },
  layerRight: {
    width: 10,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
});
