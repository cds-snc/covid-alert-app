import React, {useCallback, useState} from 'react';
import {ScrollView, Alert, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, Button, ButtonSingleLine, Toolbar} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useOutbreakService} from 'services/OutbreakService';
import {useI18n} from 'locale';
import {getCurrentDate} from 'shared/date-fns';

export const ClearOutbreakExposureScreen = () => {
  const [state, setState] = useState(ClearOutbreakExposureViewState);
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const {clearOutbreakHistory} = useOutbreakService();
  const onClearOutbreak = useCallback(async () => {
    clearOutbreakHistory();
    setState({...state, exposureHistoryClearedDate: getCurrentDate()});
  }, [clearOutbreakHistory, state]);
  const onClearOutbreakExposed = useCallback(() => {
    Alert.alert(i18n.translate('ClearOutbreakExposure.Alert.Title'), undefined, [
      {
        text: i18n.translate('ClearOutbreakExposure.Alert.Confirm'),
        onPress: () => {
          onClearOutbreak();
          close();
        },
      },
      {
        text: i18n.translate('ClearOutbreakExposure.Alert.Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  }, [close, i18n, onClearOutbreak]);

  return (
    <Box backgroundColor="overlayBackground" style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <Toolbar title="" navIcon="icon-back-arrow" navText="Close" navLabel="Close" onIconClicked={close} />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
              {i18n.translate('ClearOutbreakExposure.Title')}
            </Text>
            <Text marginBottom="m">{i18n.translate('ClearOutbreakExposure.Body')}</Text>

            <Button
              text={i18n.translate('ClearOutbreakExposure.Button')}
              onPress={onClearOutbreakExposed}
              variant="thinFlat"
            />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export const NegativeOutbreakTestButton = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const text = i18n.translate(`QRCode.OutbreakExposed.CTA`);

  const toClearOutbreakExposure = useCallback(() => navigation.navigate('ClearOutbreakExposure'), [navigation]);

  return (
    <Box>
      <Box alignSelf="stretch">
        <ButtonSingleLine iconName="icon-chevron" text={text} onPress={toClearOutbreakExposure} variant="exposure25" />
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const ClearOutbreakExposureViewState = {
  exposureHistoryClearedDate: getCurrentDate(),
};
