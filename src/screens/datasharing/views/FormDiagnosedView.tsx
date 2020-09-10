import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, Button, Text} from 'components';
import {useNavigation} from '@react-navigation/native';

import {BaseDataSharingView, StepXofY} from '../components';

export const FormDiagnosedView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('Step2'), [navigation]);
  return (
    <BaseDataSharingView>
      <Box marginHorizontal="m">
        <StepXofY currentStep={1} />
        <Text
          variant="bodyTitle"
          marginBottom="l"
          color="overlayBodyText"
          accessibilityRole="header"
          accessibilityAutoFocus
        >
          {i18n.translate('DataUpload.OtkDiagnosedView.Title')}
        </Text>
        <Text color="overlayBodyText" marginBottom="l">
          {i18n.translate('DataUpload.OtkDiagnosedView.Body')}
        </Text>
        <Box flex={1} marginBottom="m">
          <Button variant="thinFlat" text={i18n.translate('DataUpload.OtkDiagnosedView.CTA')} onPress={onNext} />
        </Box>
      </Box>
    </BaseDataSharingView>
  );
};
