import React, {useCallback, useState} from 'react';
import {Box, CodeInput, Text, Button} from 'components';
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
    const code = value.replace(/\s/g, '');
    try {
      await startSubmission(code);
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
        <Text
          variant="bodyTitle"
          color="overlayBodyText"
          accessibilityRole="header"
          // eslint-disable-next-line no-unneeded-ternary
          accessibilityAutoFocus={value === '' ? true : false}
        >
          {i18n.translate('DataUpload.FormView.Title')}
        </Text>
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Text color="overlayBodyText">{i18n.translate('DataUpload.FormView.Body')}</Text>
      </Box>
      <Box marginBottom="m" paddingHorizontal="m">
        <CodeInput
          value={value}
          onChange={onChange}
          accessibilityLabel={i18n.translate('DataUpload.FormView.InputLabel')}
        />
      </Box>
      <Box flex={1} marginHorizontal="m" marginBottom="m">
        <Button
          loading={loading}
          // @todo update this for 10 digit code
          disabled={value.length <= 7}
          variant="thinFlat"
          text={i18n.translate('DataUpload.FormView.Action')}
          onPress={handleVerify}
        />
      </Box>
    </>
  );
};
