import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar} from 'components';
import {StyleSheet, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {ExposureStatusType, useExposureStatus, cannotGetTEKsError} from 'services/ExposureNotificationService';
import {covidshield} from 'services/BackendService/covidshield';
import {xhrError} from 'shared/fetch';

import {Step1} from './views/Step1';
import {FormView} from './views/FormView';
import {ConsentView} from './views/ConsentView';

export const DataSharingScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [exposureStatus] = useExposureStatus();
  const acceptStep1 = useCallback(() => setIsConfirmedStep1(true), []);

  // if keySubmissionStatus is None we need the 1-time code, otherwise we should go right to consent
  const [isVerified, setIsVerified] = useState(exposureStatus.type === ExposureStatusType.Diagnosed);
  const [isConfirmedStep1, setIsConfirmedStep1] = useState(false);

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
      return <FormView value={codeValue} onChange={handleChange} onSuccess={handleVerify} />;
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
        <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
          {getContent()}
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
