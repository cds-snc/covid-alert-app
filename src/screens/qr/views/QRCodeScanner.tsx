import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {log} from 'shared/logging/config';
import {useOutbreakService} from 'services/OutbreakService';
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
    <BarCodeScanner
      onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
      style={{...StyleSheet.absoluteFillObject}}
    >
      <View style={styles.layerTop} />
      <Box style={styles.back} paddingHorizontal="m" paddingBottom="m">
        <Toolbar useWhiteText showBackButton />
      </Box>
      <View style={styles.layerCenter}>
        <View style={styles.layerLeft} />
        <View style={styles.focused} />
        <View style={styles.layerRight} />
      </View>
      <Box style={styles.info} alignSelf="stretch" paddingVertical="m" paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" color="bodyTitleWhite">
          {i18n.translate(`QRCode.Reader.Title`)}
        </Text>
        <Icon size={175} name="scan-qr-code-white-arrow" />
      </Box>
      <View style={styles.layerBottom} />
    </BarCodeScanner>
  );
};

const opacity = 'rgba(0, 0, 0, .8)';

const styles = StyleSheet.create({
  info: {
    backgroundColor: opacity,
  },
  back: {
    backgroundColor: opacity,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  backText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 18,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 10,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 20,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
});
