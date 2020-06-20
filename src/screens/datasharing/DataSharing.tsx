import React, {useCallback, useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar} from 'components';
import {StyleSheet, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {useExposureStatus} from 'services/ExposureNotificationService';

import {BottomSheetClose} from '../../shared/bottomSheetClose';

import {FormView} from './views/FormView';
import {ConsentView} from './views/ConsentView';

export const DataSharingScreen = () => {
  const navigation = useNavigation();
  const [i18n] = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [exposureStatus] = useExposureStatus();
  const [codeValue, setCodeValue] = useState('');
  const handleChange = useCallback(text => setCodeValue(text), []);
  // if keySubmissionStatus is None we need the 1-time code, otherwise we should go right to consent
  const [isVerified, setIsVerified] = useState(exposureStatus.type === 'diagnosed');
  const BottomSheetCloseFn = useContext(BottomSheetClose);

  const onError = useCallback(() => {
    Alert.alert(i18n.translate('DataUpload.ErrorTitle'), i18n.translate('DataUpload.ErrorBody'), [
      {text: i18n.translate('DataUpload.ErrorAction')},
    ]);
    setIsVerified(false);
  }, [i18n]);
  const handleVerify = useCallback(async () => {
    setIsVerified(true);
  }, []);

  const handleUploaded = useCallback(() => {
    BottomSheetCloseFn();
    navigation.goBack();
  }, [BottomSheetCloseFn, navigation]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title={isVerified ? i18n.translate('DataUpload.ConsentTitle') : ''}
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <ScrollView>
          {!isVerified && (
            <FormView value={codeValue} onChange={handleChange} onSuccess={handleVerify} onError={onError} />
          )}
          {isVerified && <ConsentView onSuccess={handleUploaded} onError={onError} />}
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
