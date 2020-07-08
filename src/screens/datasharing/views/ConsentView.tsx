import React, {useCallback, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useReportDiagnosis} from 'services/ExposureNotificationService';

interface Props {
  onSuccess: () => void;
  onError: () => void;
}

export const ConsentView = ({onSuccess, onError}: Props) => {
  const [i18n] = useI18n();
  const [loading, setLoading] = useState(false);
  const {fetchAndSubmitKeys} = useReportDiagnosis();

  const handleUpload = useCallback(async () => {
    setLoading(true);
    try {
      await fetchAndSubmitKeys();
      setLoading(false);
      onSuccess();
    } catch {
      setLoading(false);
      onError();
    }
  }, [fetchAndSubmitKeys, onError, onSuccess]);

  if (loading) {
    return (
      <Box margin="xxl" flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#0278A4" />
      </Box>
    );
  }
  return (
    <>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.ConsentView.Title')}
          </Text>

          <Text marginBottom="m">{i18n.translate('DataUpload.ConsentView.Body1')}</Text>
          <Text marginBottom="m">
            <Text fontWeight="bold">{i18n.translate('DataUpload.ConsentView.Body2a')}</Text>
            <Text>{i18n.translate('DataUpload.ConsentView.Body2b')}</Text>
          </Text>

          <Text marginBottom="l">{i18n.translate('DataUpload.ConsentView.Body3')}</Text>
        </Box>
      </ScrollView>
      <Box paddingHorizontal="m" paddingTop="m" marginBottom="m">
        <Button variant="thinFlat" text={i18n.translate('DataUpload.ConsentView.Action')} onPress={handleUpload} />
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
