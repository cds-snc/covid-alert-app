import React, {useCallback} from 'react';
import {Text, Box, ButtonSingleLine} from 'components';
import {Alert} from 'react-native';
import {useClearExposedStatus} from 'services/ExposureNotificationService';
import {useI18n} from 'locale';

export const ClearExposureView = () => {
  const i18n = useI18n();
  const [clearExposedStatus] = useClearExposedStatus();
  const onClearExposedState = useCallback(() => {
    Alert.alert(
      i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Body'),
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Accept'),
          onPress: () => {
            console.log('Accept Pressed');
            clearExposedStatus();
          },
          style: 'default',
        },
      ],
      {cancelable: true},
    );
  }, [clearExposedStatus]);
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate(`Home.ExposureDetected.Dismiss.Title`)}
      </Text>

      <Text marginBottom="m">
        <Text>{i18n.translate('Home.ExposureDetected.Dismiss.Body')}</Text>
      </Text>

      <Box alignSelf="stretch" marginTop="s" marginBottom="m">
        <ButtonSingleLine
          iconName="icon-check-white"
          text={i18n.translate('Home.ExposureDetected.Dismiss.CTA')}
          onPress={onClearExposedState}
          variant="bigFlatPurple"
        />
      </Box>
    </>
  );
};
