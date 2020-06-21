import {useI18n} from '@shopify/react-i18n';
import {Box, Button, Text} from 'components';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsDisabledView = () => {
  const [i18n] = useI18n();

  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.ExposureNotificationsDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.ExposureNotificationsDisabledDetailed')}
      </Text>
      <Box alignSelf="stretch" marginBottom="l">
        <Button
          internalLink
          text={i18n.translate('Home.EnableExposureNotificationsCTA')}
          variant="danger50Flat"
          onPress={toSettings}
        />
      </Box>
    </BaseHomeView>
  );
};
