import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {Linking, Platform} from 'react-native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {EventTypeMetric, useMetrics} from 'shared/metrics';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsDisabledView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();
  const addEvent = useMetrics();

  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const startEn = useCallback(async () => {
    await startExposureNotificationService();
    addEvent(EventTypeMetric.EnToggle);
  }, [addEvent, startExposureNotificationService]);

  const onPress = () => {
    if (Platform.OS === 'android') {
      return startEn();
    }
    return toSettings();
  };
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="exposureNotificationsDisabled">
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.EnDisabled.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.EnDisabled.Body1')}
      </Text>
      <Box alignSelf="stretch" marginBottom="m" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.EnDisabled.CTA')}
          variant="danger50Flat"
          internalLink
          onPress={onPress}
        />
      </Box>
    </BaseHomeView>
  );
};
