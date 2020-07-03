import {useI18n} from '@shopify/react-i18n';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsDisabledView = () => {
  const [i18n] = useI18n();

  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureNotificationsDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.ExposureNotificationsDisabledDetailed')}
      </Text>
      <Box alignSelf="stretch" marginBottom="xl" marginTop="xl">
        <ButtonSingleLine
          text={i18n.translate('Home.EnableExposureNotificationsCTA')}
          variant="danger50Flat"
          internalLink
          onPress={toSettings}
        />
      </Box>
    </BaseHomeView>
  );
};
