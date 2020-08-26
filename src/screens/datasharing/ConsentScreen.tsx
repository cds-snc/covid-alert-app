import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, ScrollView, StyleSheet, Alert} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useReportDiagnosis, cannotGetTEKsError} from 'services/ExposureNotificationService';
import {covidshield} from 'services/BackendService/covidshield';
import {xhrError} from 'shared/fetch';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const ConsentScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const [loading, setLoading] = useState(false);
  const {fetchAndSubmitKeys} = useReportDiagnosis();
  const onSuccess = useCallback(() => {
    // todo: fix this
    navigation.navigate('Home');
  }, [navigation]);
  // TEK = Temporary Exposure Key
  const getTranslationKey = (error: any) => {
    if (Object.values(covidshield.EncryptedUploadResponse.ErrorCode).includes(error)) {
      return 'TekUploadServer';
    }
    if (error === xhrError) {
      return 'TekUploadOffline';
    }
    if (error === cannotGetTEKsError) {
      return 'TekUploadPermission';
    }
    // default case
    return 'TekUploadServer';
  };
  const onError = useCallback(
    (error: any) => {
      const translationKey = getTranslationKey(error);
      Alert.alert(i18n.translate(`Errors.${translationKey}.Title`), i18n.translate(`Errors.${translationKey}.Body`), [
        {text: i18n.translate(`Errors.Action`)},
      ]);
    },
    [i18n],
  );

  const handleUpload = useCallback(async () => {
    setLoading(true);
    try {
      await fetchAndSubmitKeys();
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      onError(error);
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
    <BaseDataSharingView>
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
    </BaseDataSharingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
