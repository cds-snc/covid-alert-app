import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, ScrollView, StyleSheet, Alert} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useReportDiagnosis, cannotGetTEKsError, useExposureHistory} from 'services/ExposureNotificationService';
import {covidshield} from 'services/BackendService/covidshield';
import {xhrError} from 'shared/fetch';
import {ContagiousDateInfo, ContagiousDateType} from 'shared/DataSharing';
import {EventTypeMetric, FilteredMetricsService} from 'services/MetricsService';
import {DefaultFutureStorageService, StorageDirectory} from 'services/StorageService';

import {BaseDataSharingView} from './BaseDataSharingView';

interface BaseTekUploadViewProps {
  buttonText: string;
  contagiousDateInfo: ContagiousDateInfo;
  children?: React.ReactNode;
  secondaryButtonText?: string;
  secondaryButtonOnPress?(): void;
  showBackButton?: boolean;
  closeRoute?: string;
  uploadOtkEntryMetric?: boolean;
}

export const BaseTekUploadView = ({
  children,
  contagiousDateInfo,
  buttonText,
  secondaryButtonText,
  secondaryButtonOnPress,
  showBackButton = true,
  closeRoute = '',
  uploadOtkEntryMetric = true,
}: BaseTekUploadViewProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const [loading, setLoading] = useState(false);
  const {fetchAndSubmitKeys, setIsUploading} = useReportDiagnosis();
  const exposureHistory = useExposureHistory();

  const onSuccess = useCallback(() => {
    DefaultFutureStorageService.sharedInstance().save(StorageDirectory.GlobalInitialTekUploadCompleteKey, 'true');
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
  const validateInput = () => {
    if (contagiousDateInfo.dateType !== ContagiousDateType.None && !contagiousDateInfo.date) {
      Alert.alert(i18n.translate(`Errors.TekUploadNoDate.Title`), i18n.translate(`Errors.TekUploadNoDate.Body`), [
        {text: i18n.translate(`Errors.Action`)},
      ]);
      return false;
    }
    return true;
  };
  const handleUpload = useCallback(async () => {
    setLoading(true);
    setIsUploading(true);

    try {
      await fetchAndSubmitKeys(contagiousDateInfo);
      setLoading(false);
      setIsUploading(false);

      if (uploadOtkEntryMetric) {
        FilteredMetricsService.sharedInstance().addEvent({
          type: EventTypeMetric.OtkEntered,
          withDate: contagiousDateInfo.dateType !== ContagiousDateType.None,
          isUserExposed: exposureHistory.length > 0,
        });
      }

      onSuccess();
    } catch (error) {
      setLoading(false);
      setIsUploading(false);
      onError(error);
    }
  }, [
    contagiousDateInfo,
    exposureHistory.length,
    fetchAndSubmitKeys,
    onError,
    onSuccess,
    setIsUploading,
    uploadOtkEntryMetric,
  ]);

  if (loading) {
    return (
      <Box margin="xxl" flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#0278A4" />
      </Box>
    );
  }
  return (
    <BaseDataSharingView showBackButton={showBackButton} closeRoute={closeRoute}>
      <ScrollView style={styles.flex}>{children}</ScrollView>
      <Box paddingHorizontal="m" paddingTop="m" marginBottom="m">
        <Button
          variant="thinFlat"
          text={buttonText}
          onPress={() => {
            const inputValid = validateInput();
            if (!inputValid) {
              return;
            }
            handleUpload();
          }}
        />
      </Box>
      {secondaryButtonText && secondaryButtonOnPress ? (
        <Box paddingHorizontal="m" marginBottom="m">
          <Button variant="thinFlatBlue" text={secondaryButtonText} onPress={secondaryButtonOnPress} />
        </Box>
      ) : null}
    </BaseDataSharingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
