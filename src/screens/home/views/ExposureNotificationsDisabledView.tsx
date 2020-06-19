import {useI18n} from '@shopify/react-i18n';
import {Box, Button, Text} from 'components';
import React, {useCallback} from 'react';
import {useStartENSystem} from 'services/ExposureNotificationService';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsDisabledView = () => {
  const [i18n] = useI18n();
  const startSystem = useStartENSystem();

  const enableExposureNotifications = useCallback(() => {
    startSystem();
  }, [startSystem]);

  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.ExposureNotificationsDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.ExposureNotificationsDisabledDetailed')}
      </Text>
      <Box alignSelf="stretch" marginTop="l">
        <Button
          internalLink
          text={i18n.translate('Home.EnableExposureNotificationsCTA')}
          variant="danger50Flat"
          onPress={enableExposureNotifications}
        />
      </Box>
    </BaseHomeView>
  );
};
