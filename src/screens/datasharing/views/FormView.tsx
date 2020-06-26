import React, {useCallback, useState} from 'react';
import {useNavigation, NavigationHelpersContext} from '@react-navigation/native';
import {Box, CodeInput, Text, Button, Toolbar} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useReportDiagnosis} from 'services/ExposureNotificationService';
import {Step1} from './Step1';

export interface FormViewProps {
  value: string;
  onChange: (value: string) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const FormView = ({value, onChange, onSuccess, onError}: FormViewProps) => {
  const [i18n] = useI18n();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const acceptStep1 = useCallback(() => setIsConfirmedStep1(true), []);
  const [isConfirmedStep1, setIsConfirmedStep1] = useState(false);

  const cancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {startSubmission} = useReportDiagnosis();
  const handleVerify = useCallback(async () => {
    setLoading(true);
    try {
      await startSubmission(value);
      setLoading(false);
      onSuccess();
    } catch {
      setLoading(false);
      onError();
    }
  }, [startSubmission, value, onSuccess, onError]);

  return (
    <>
      <Toolbar
        title=""
        navIcon="icon-back-arrow"
        navText={i18n.translate('DataUpload.FormIntroCancel')}
        navLabel={i18n.translate('DataUpload.FormIntroCancel')}
        onIconClicked={cancel}
      />
      <Box marginHorizontal="m" marginBottom="l">
        <Text variant="bodyTitle" color="overlayBodyText" accessibilityRole="header">
          {i18n.translate('DataUpload.FormIntro')}
        </Text>

        <Text marginTop="xl" variant="bodyText" color="bodyText" accessibilityRole="text">
          {i18n.translate('DataUpload.FormIntroBody')}
        </Text>
      </Box>
      <Box marginBottom="m">
        <CodeInput value={value} onChange={onChange} accessibilityLabel={i18n.translate('DataUpload.InputLabel')} />
      </Box>
      <Box flex={1} marginHorizontal="m" marginBottom="m">
        <Button
          loading={loading}
          // disabled={value.length !== 8}
          variant="thinFlat"
          text={i18n.translate('DataUpload.Action')}
          onPress={handleVerify}
        />
      </Box>
    </>
  );
};
