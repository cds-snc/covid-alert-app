import React, {useCallback, useState} from 'react';
import {Box, Text, Button, TextInput} from 'components';
import {useI18n} from 'locale';
import {useReportDiagnosis} from 'services/ExposureNotificationService';

export interface FormViewProps {
  value: string;
  onChange: (value: string) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const FormView = ({value, onChange, onSuccess, onError}: FormViewProps) => {
  const i18n = useI18n();
  const [loading, setLoading] = useState(false);
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
      <Box marginHorizontal="m" marginBottom="l">
        <Text variant="bodyTitle" color="overlayBodyText" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.FormView.Title')}
        </Text>
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Text color="overlayBodyText">{i18n.translate('DataUpload.FormView.Body')}</Text>
      </Box>
      <Box marginBottom="m">
        <TextInput
          value={value}
          onChangeText={onChange}
          autoCorrect={false}
          autoCompleteType="off"
          returnKeyType="done"
          accessibilityLabel={i18n.translate('DataUpload.FormView.InputLabel')}
          maxLength={8}
          paddingLeft="m"
          paddingRight="m"
          paddingTop="m"
          paddingBottom="m"
          fontSize={36}
          textAlign="center"
          placeholder={i18n.translate('DataUpload.FormView.Placeholder')}
        />
      </Box>
      <Box flex={1} marginHorizontal="m" marginBottom="m">
        <Button
          loading={loading}
          disabled={value.length !== 8}
          variant="thinFlat"
          text={i18n.translate('DataUpload.FormView.Action')}
          onPress={handleVerify}
        />
      </Box>
    </>
  );
};
