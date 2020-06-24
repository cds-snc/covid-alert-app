import React, {useCallback, useState} from 'react';
import {Box, CodeInput, Text, Button} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useReportDiagnosis} from 'services/ExposureNotificationService';

export interface FormViewProps {
  value: string;
  onChange: (value: string) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const FormView = ({value, onChange, onSuccess, onError}: FormViewProps) => {
  const [i18n] = useI18n();
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
      <Box marginHorizontal="xxl" marginVertical="l">
        <Text variant="bodyTitle" color="overlayBodyText" accessibilityRole="header">
          {i18n.translate('DataUpload.FormIntro')}
        </Text>
      </Box>
      <Box paddingHorizontal="m" marginBottom="m">
        <CodeInput value={value} onChange={onChange} accessibilityLabel={i18n.translate('DataUpload.InputLabel')} />
      </Box>
      <Box flex={1} marginHorizontal="xxl" marginBottom="m">
        <Button
          loading={loading}
          disabled={value.length !== 8}
          variant="bigFlat"
          text={i18n.translate('DataUpload.Action')}
          onPress={handleVerify}
        />
      </Box>
    </>
  );
};
