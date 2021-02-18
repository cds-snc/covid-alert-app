import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsUserStoppedView = () => {
  const i18n = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();

  const startEn = useCallback(async () => {
    await startExposureNotificationService();
  }, [startExposureNotificationService]);

  const onPress = async () => {
    await startEn();
  };

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="exposureNotificationsDisabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.UserStopped.Title')}
      </Text>
      <Box alignSelf="stretch" marginBottom="m" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.UserStopped.CTA')}
          variant="danger50Flat"
          internalLink
          onPress={onPress}
        />
      </Box>
    </BaseHomeView>
  );
};
