import React, {useCallback, useState} from 'react';
import {ScrollView, Alert, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, Button, ButtonSingleLine, ToolbarWithClose} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useOutbreakService} from 'services/OutbreakService';
import {useI18n} from 'locale';
import {useClearExposedStatus, useExposureStatus} from 'services/ExposureNotificationService';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {getCurrentDate, getMillisSinceUTCEpoch} from 'shared/date-fns';

export const ClearOutbreakExposureScreen = () => {
  const [state, setState] = useState(ClearOutbreakExposureViewState);
  const navigation = useNavigation();
  const i18n = useI18n();

  const close = useCallback(() => navigation.navigate('Home', {timestamp: getMillisSinceUTCEpoch()}), [navigation]);
  const {ignoreAllOutbreaks} = useOutbreakService();
  const [clearExposedStatus] = useClearExposedStatus();
  const exposureStatus = useExposureStatus();
  const onClearOutbreak = useCallback(async () => {
    ignoreAllOutbreaks();
    setState({...state, exposureHistoryClearedDate: getCurrentDate()});
  }, [ignoreAllOutbreaks, state]);
  const onClearOutbreakExposed = useCallback(() => {
    Alert.alert(i18n.translate('ClearOutbreakExposure.Alert.Title'), undefined, [
      {
        text: i18n.translate('ClearOutbreakExposure.Alert.Confirm'),
        onPress: () => {
          onClearOutbreak();
          clearExposedStatus();
          FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ExposedClear, exposureStatus});
          close();
        },
        style: 'cancel',
      },
      {
        text: i18n.translate('ClearOutbreakExposure.Alert.Cancel'),
        onPress: () => {},
        style: 'default',
      },
    ]);
  }, [close, i18n, onClearOutbreak, clearExposedStatus, exposureStatus]);

  return (
    <Box backgroundColor="overlayBackground" style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('LanguageSelect.Close')} showBackButton={false} onClose={close} />
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
