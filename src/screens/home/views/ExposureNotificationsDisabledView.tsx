import {useI18n} from '@shopify/react-i18n';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {Linking, Platform} from 'react-native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsDisabledView = () => {
  const [i18n] = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();

  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const onPress = () => {
    if (Platform.OS === 'android') {
      startExposureNotificationService();
      return;
    }
    return toSettings();
  };

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureNotificationsDisabled')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.ExposureNotificationsDisabledDetailed')}
      </Text>
      <Box alignSelf="stretch" marginBottom="l" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.EnableExposureNotificationsCTA')}
          variant="danger50Flat"
          internalLink
          onPress={onPress}
        />
      </Box>
    </BaseHomeView>
  );
};
