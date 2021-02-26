import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, Button, ButtonSingleLine, Toolbar} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useClearExposedStatus, useExposureStatus} from 'services/ExposureNotificationService';
import {useI18n} from 'locale';
import {FilteredMetricsService} from 'services/MetricsService/FilteredMetricsService';
import {EventTypeMetric} from 'services/MetricsService/MetricsFilter';

export const DismissAlertScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [clearExposedStatus] = useClearExposedStatus();
  const exposureStatus = useExposureStatus();

  const onClearExposedState = useCallback(() => {
    Alert.alert(i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Body'), undefined, [
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Accept'),
        onPress: () => {
          clearExposedStatus();
          FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ExposedClear, exposureStatus});
          close();
        },
        style: 'default',
      },
    ]);
  }, [clearExposedStatus, close, exposureStatus, i18n]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('LanguageSelect.Close')}
          navLabel={i18n.translate('LanguageSelect.Close')}
          onIconClicked={close}
        />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Box>
              <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
                {i18n.translate('Home.ExposureDetected.Dismiss.Title')}
              </Text>

              <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Dismiss.Body')}</Text>
              <Text marginBottom="l">{i18n.translate('Home.ExposureDetected.Dismiss.Body2')}</Text>

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
