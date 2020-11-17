import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {useStorage} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureNotificationsUserStoppedView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {setUserStopped} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();

  const startEn = useCallback(() => {
    setUserStopped(false);
    startExposureNotificationService();
  }, [setUserStopped, startExposureNotificationService]);

  const onPress = () => {
    return startEn();
  };
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="exposureNotificationsDisabled">
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
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
