import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {Box, ButtonSingleLine, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {log} from 'shared/logging/config';

import {Toolbar} from '../components/Toolbar';
import {handleOpenURL} from '../utils';

export const QRCodeScanner = () => {
  const navigation = useNavigation();
  const {setCheckInJSON} = useStorage();
  const [scanned, setScanned] = useState<boolean>(false);

  const i18n = useI18n();
  const handleBarCodeScanned = async (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    const result = await handleOpenURL({url: data});
    setScanned(true);

    if (typeof result === 'boolean') {
      log.debug({message: `Incorrect code with type ${type} and data ${data} has been scanned!`});
      navigation.navigate('ScanErrorScreen');
    } else {
      setCheckInJSON(result.id.toString());
      navigation.navigate('CheckInSuccessfulScreen', result);
    }
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
      style={{...StyleSheet.absoluteFillObject}}
    >
      <View style={styles.layerTop} />
      <Box style={styles.back} paddingHorizontal="m">
        <Toolbar useWhiteText={true} onClose={() => {}} showBackButton={true} />
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
        <Text variant="bodyText" marginBottom="m" color="bodyTextWhite">
          {i18n.translate(`QRCode.Reader.Body`)}
        </Text>
        <ButtonSingleLine
          text={i18n.translate('QRCode.Reader.Learn')}
          variant="thinFlatNeutralGrey"
          onPress={() => {
            navigation.navigate('LearnAboutQRScreen');
            setScanned(false);
          }}
          iconName="icon-chevron"
        />
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
    flex: 5,
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
    flex: 2,
    backgroundColor: opacity,
  },
});
