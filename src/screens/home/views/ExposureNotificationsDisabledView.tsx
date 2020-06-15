import {useI18n} from '@shopify/react-i18n';
import {Box, Button, Icon, LastCheckedDisplay, Text} from 'components';
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
      <Box marginBottom="l">
        <Icon name="icon-exposure-notifications-disabled" size={44} />
      </Box>
      <Text textAlign="center" variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.ExposureNotificationsDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" textAlign="center">
        {i18n.translate('Home.ExposureNotificationsDisabledDetailed')}
      </Text>
      <LastCheckedDisplay />
      <Box alignSelf="stretch" marginTop="l">
        <Button
          text={i18n.translate('Home.EnableExposureNotificationsCTA')}
          variant="bigFlat"
          onPress={enableExposureNotifications}
        />
      </Box>
    </BaseHomeView>
  );
};
