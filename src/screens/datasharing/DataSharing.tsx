import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar} from 'components';
import {StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Dimensions, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {useExposureStatus} from 'services/ExposureNotificationService';

import {Step1} from './views/Step1';
import {FormView} from './views/FormView';
import {ConsentView} from './views/ConsentView';

export const DataSharingScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [exposureStatus] = useExposureStatus();
  const [codeValue, setCodeValue] = useState('');
  const handleChange = useCallback(text => setCodeValue(text), []);
  const acceptStep1 = useCallback(() => setIsConfirmedStep1(true), []);

  // if keySubmissionStatus is None we need the 1-time code, otherwise we should go right to consent
  const [isVerified, setIsVerified] = useState(exposureStatus.type === 'diagnosed');
  const [isConfirmedStep1, setIsConfirmedStep1] = useState(false);
  const onErrorForm = () => {
    Alert.alert(i18n.translate('DataUpload.FormView.ErrorTitle'), i18n.translate('DataUpload.FormView.ErrorBody'), [
      {text: i18n.translate('DataUpload.FormView.ErrorAction')},
    ]);
    setIsVerified(false);
  };

  const onErrorConsent = () => {
    Alert.alert(
      i18n.translate('DataUpload.ConsentView.ErrorTitle'),
      i18n.translate('DataUpload.ConsentView.ErrorBody'),
      [{text: i18n.translate('DataUpload.FormView.ErrorAction')}],
    );
  };

  const handleVerify = useCallback(async () => {
    setIsVerified(true);
  }, []);

  const handleUploaded = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getContent = () => {
    if (isVerified) {
      return <ConsentView onSuccess={handleUploaded} onError={onErrorConsent} />;
    } else if (!isVerified && isConfirmedStep1) {
      return <FormView value={codeValue} onChange={handleChange} onSuccess={handleVerify} onError={onErrorForm} />;
    } else {
      return <Step1 onSuccess={acceptStep1} />;
    }
  };

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Dimensions.get('screen').height / 10}
        >
          <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
            {getContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
