import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, Button, ButtonSingleLine, ToolbarWithClose} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useClearExposedStatus, useExposureStatus} from 'services/ExposureNotificationService';
import {useI18n} from 'locale';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {useOutbreakService} from 'services/OutbreakService';
import {useCachedStorage} from 'services/StorageService';

export const DismissAlertScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [clearExposedStatus] = useClearExposedStatus();
  const exposureStatus = useExposureStatus();
  const outbreaks = useOutbreakService();
  const {qrEnabled} = useCachedStorage();

  const onClearExposedState = useCallback(() => {
    Alert.alert(i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Body'), undefined, [
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Cancel'),
        onPress: () => {},
        style: 'default',
      },
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Accept'),
        onPress: () => {
          outbreaks.ignoreAllOutbreaks();
          clearExposedStatus();
          FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ExposedClear, exposureStatus});
          close();
        },
        style: 'cancel',
      },
    ]);
  }, [clearExposedStatus, close, exposureStatus, i18n, outbreaks]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('LanguageSelect.Close')} showBackButton={false} onClose={close} />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Box>
              <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
                {i18n.translate('Home.ExposureDetected.Dismiss.Title')}
              </Text>

              <Text marginBottom="l">
                {i18n.translate('Home.ExposureDetected.Dismiss.Body')}
                {qrEnabled && i18n.translate('Home.ExposureDetected.Dismiss.Body1')}
              </Text>

              <Button
                text={i18n.translate('Home.ExposureDetected.Dismiss.CTA')}
                onPress={onClearExposedState}
                variant="thinFlat"
              />
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export const NegativeTestButton = () => {
  const i18n = useI18n();
  const navigation = useNavigation();

  const onDismissAlert = useCallback(() => navigation.navigate('DismissAlert'), [navigation]);

  return (
    <Box>
      <Box alignSelf="stretch">
        <ButtonSingleLine
          iconName="icon-chevron"
          text={i18n.translate('Home.ExposureDetected.NegativeTest.CTA')}
          onPress={onDismissAlert}
          variant="exposure25"
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
