import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {Linking, Platform} from 'react-native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const LocationOffView = () => {
  const i18n = useI18n();
  const startExposureNotificationService = useStartExposureNotificationService();

  const toSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const startEn = useCallback(() => {
    startExposureNotificationService();
  }, [startExposureNotificationService]);

  const onPress = () => {
    if (Platform.OS === 'android') {
      return startEn();
    }
    return toSettings();
  };

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <HomeScreenTitle>{i18n.translate('Home.EnDisabled.Title')}</HomeScreenTitle>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.EnDisabled.Body1')}
      </Text>
      <Box alignSelf="stretch" marginBottom="l" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.EnDisabled.CTA')}
          variant="danger50Flat"
          internalLink
          onPress={onPress}
        />
      </Box>
      <Box marginBottom="m">
        <Text marginBottom="m" variant="bodySubTitle">
          {i18n.translate('Home.EnDisabled.AndroidTitle2')}
        </Text>
        <Text marginBottom="m">{i18n.translate('Home.EnDisabled.AndroidBody1')}</Text>
        <Text>
          <Text>{i18n.translate('Home.EnDisabled.AndroidBody2a')}</Text>
          <Text fontWeight="bold">{i18n.translate('Home.EnDisabled.AndroidBody2b')}</Text>
          <Text>{i18n.translate('Home.EnDisabled.AndroidBody2c')}</Text>
        </Text>
      </Box>
    </BaseHomeView>
  );
};
