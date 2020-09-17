import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, ScrollView, StyleSheet, Alert} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useReportDiagnosis, cannotGetTEKsError} from 'services/ExposureNotificationService';
import {covidshield} from 'services/BackendService/covidshield';
import {xhrError} from 'shared/fetch';
import AsyncStorage from '@react-native-community/async-storage';
import {INITIAL_TEK_UPLOAD_COMPLETE} from 'shared/DataSharing';

import {BaseDataSharingView} from './BaseDataSharingView';

export interface ContagiousDateInfo {
  dateType: 'symptomOnsetDate' | 'testDate' | 'noDate';
  dateString: string;
}

interface BaseTekUploadViewProps {
  buttonText: string;
  contagiousDateInfo: ContagiousDateInfo;
  children?: React.ReactNode;
  secondaryButtonText?: string;
  secondaryButtonOnPress?(): void;
  dateSelected?: boolean;
  showBackButton?: boolean;
}

export const BaseTekUploadView = ({
  children,
  contagiousDateInfo,
  buttonText,
  secondaryButtonText,
  secondaryButtonOnPress,
  dateSelected = false,
  showBackButton = true,
}: BaseTekUploadViewProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const [loading, setLoading] = useState(false);
  const {fetchAndSubmitKeys} = useReportDiagnosis();

  const onSuccess = useCallback(() => {
    AsyncStorage.setItem(INITIAL_TEK_UPLOAD_COMPLETE, 'true');
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
    if (!dateSelected) {
      Alert.alert(i18n.translate(`Errors.TekUploadNoDate.Title`), i18n.translate(`Errors.TekUploadNoDate.Body`), [
        {text: i18n.translate(`Errors.Action`)},
      ]);
      return false;
    }
    return true;
  };
  const handleUpload = useCallback(async () => {
    setLoading(true);
    try {
      await fetchAndSubmitKeys(contagiousDateInfo);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      onError(error);
    }
  }, [contagiousDateInfo, fetchAndSubmitKeys, onError, onSuccess]);

  if (loading) {
    return (
      <Box margin="xxl" flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#0278A4" />
      </Box>
    );
  }
  return (
    <BaseDataSharingView showBackButton={showBackButton}>
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
