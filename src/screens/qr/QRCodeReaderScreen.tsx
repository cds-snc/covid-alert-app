import React, {useState, useEffect} from 'react';
import {Box, ButtonSingleLine, Text, Button} from 'components';
import {View, StyleSheet, Alert} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';

interface EventURL {
  url: string;
}

interface EventData {
  id: string;
  name: string;
}

const CheckinRoute = 'QRCodeScreen';

// covidalert://QRCodeScreen/id/1/location_name
const handleOpenURL = ({url}: EventURL): EventData | boolean => {
  const [, , routeName, , id, name] = url.split('/');

  if (routeName === CheckinRoute) {
    return {id, name};
  }
  return false;
};

const Content = () => {
  const navigation = useNavigation();
  const {setCheckInJSON} = useStorage();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const i18n = useI18n();

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    const {type, data} = scanningResult;
    setScanned(true);

    const result = handleOpenURL({url: data});

    if (typeof result === 'boolean') {
      const msg = `Incorrect code with type ${type} and data ${data} has been scanned!`;
      Alert.alert('Error', msg, [{text: i18n.translate(`Errors.Action`)}]);
    } else {
      setCheckInJSON(result.id.toString());
      navigation.navigate(CheckinRoute, result);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
      style={{...StyleSheet.absoluteFillObject}}
    >
      <View style={styles.layerTop} />

      <Box style={styles.back}>
        <Button
          color="bodyTextWhite"
          text={i18n.translate(`QRCode.Reader.Back`)}
          variant="text"
          onPress={() => {
            navigation.navigate('Home');
          }}
          backButton={true}
        />
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
            navigation.navigate('Home');
            setScanned(false);
          }}
          iconName="icon-chevron"
        />
      </Box>

      <View style={styles.layerBottom} />
    </BarCodeScanner>
  );
};

export const QRCodeReaderScreen = () => {
  return (
    <Box flex={1} alignSelf="stretch">
      <Content />
    </Box>
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
    alignContent: 'flex-start',
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
