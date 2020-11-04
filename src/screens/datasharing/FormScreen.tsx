import React, {useCallback, useState} from 'react';
import {Box, CodeInput, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useReportDiagnosis, ExposureStatusType, useExposureStatus} from 'services/ExposureNotificationService';
import {Alert} from 'react-native';
import {covidshield} from 'services/BackendService/covidshield';
import {xhrError} from 'shared/fetch';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {INITIAL_TEK_UPLOAD_COMPLETE} from 'shared/DataSharing';

import {BaseDataSharingView, StepXofY} from './components';
import {FormDiagnosedView} from './views/FormDiagnosedView';

export const FormScreen = () => {
  const i18n = useI18n();
  const [codeValue, setCodeValue] = useState('');
  const handleChange = useCallback(text => setCodeValue(text), []);
  const navigation = useNavigation();
  const exposureStatus = useExposureStatus();
  const [loading, setLoading] = useState(false);
  const {startSubmission} = useReportDiagnosis();
  const onSuccess = useCallback(() => {
    AsyncStorage.setItem(INITIAL_TEK_UPLOAD_COMPLETE, 'false');
    navigation.navigate('Step2');
  }, [navigation]);

  const getTranslationKey = (error: any) => {
    // OTC = One time code (diagnosis code)
    switch (error) {
      case covidshield.KeyClaimResponse.ErrorCode.INVALID_ONE_TIME_CODE:
        return 'OtcUploadInvalidOneTimeCode';
      case covidshield.KeyClaimResponse.ErrorCode.TEMPORARY_BAN:
        return 'OtcUploadTemporaryBan';
      case xhrError:
        return 'OtcUploadOffline';
      default:
        return 'OtcUploadDefault';
    }
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
    if (codeValue.length < 1) {
      Alert.alert(i18n.translate(`Errors.OtcCodeNotEntered.Title`), i18n.translate(`Errors.OtcCodeNotEntered.Body`), [
        {text: i18n.translate(`Errors.Action`)},
      ]);
      return false;
    }
    return true;
  };
  const onSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await startSubmission(codeValue);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      onError(error);
    }
  }, [startSubmission, codeValue, onSuccess, onError]);

  if (exposureStatus.type === ExposureStatusType.Diagnosed) {
    return <FormDiagnosedView />;
  }

  return (
    <BaseDataSharingView>
      <Box marginHorizontal="m" marginBottom="l">
        <StepXofY currentStep={1} />
        <Text
          variant="bodyTitle"
          color="overlayBodyText"
          accessibilityRole="header"
          // eslint-disable-next-line no-unneeded-ternary
          accessibilityAutoFocus={codeValue === '' ? true : false}
        >
          {i18n.translate('DataUpload.FormView.Title')}
        </Text>
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Text color="overlayBodyText">{i18n.translate('DataUpload.FormView.Body')}</Text>
      </Box>
      <Box marginBottom="m" paddingHorizontal="m">
        <CodeInput
          value={codeValue}
          onChange={handleChange}
          accessibilityLabel={i18n.translate('DataUpload.FormView.InputLabel')}
        />
      </Box>
      <Box flex={1} marginHorizontal="m" marginBottom="m">
        <Button
          loading={loading}
          variant="thinFlat"
          text={i18n.translate('DataUpload.FormView.Action')}
          onPress={() => {
            const inputValid = validateInput();
            if (!inputValid) {
              return;
            }
            onSubmit();
          }}
        />
      </Box>
    </BaseDataSharingView>
  );
};
