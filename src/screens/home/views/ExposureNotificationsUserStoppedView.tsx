import {useI18n} from 'locale';
import {Box, ButtonSingleLine} from 'components';
import React, {useCallback} from 'react';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const ExposureNotificationsUserStoppedView = () => {
  const i18n = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();

  const startEn = useCallback(async () => {
    await startExposureNotificationService(true);
  }, [startExposureNotificationService]);

  const onPress = async () => {
    await startEn();
  };

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="exposureNotificationsDisabled">
      <HomeScreenTitle>{i18n.translate('Home.UserStopped.Title')}</HomeScreenTitle>
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
