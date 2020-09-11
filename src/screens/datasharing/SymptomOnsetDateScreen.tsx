import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';

import {BaseTekUploadView, DatePicker, StepXofY} from './components';

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();
  // todo: get {dateType: 'symptomOnsetDate', dateString: selectedDate} to the backend service
  const navigation = useNavigation();
  const secondaryButtonOnPress = useCallback(() => navigation.navigate('TekUploadNoDate'), [navigation]);
  const {data} = useContext(FormContext);

  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.SymptomOnsetDate.CTA')}
      contagiousDateInfo={{dateType: 'symptomOnsetDate', dateString: data.selectedDate}}
      secondaryButtonText={i18n.translate('DataUpload.SymptomOnsetDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
      primaryButtonDisabled={data.selectedDate === ''}
    >
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          <DatePicker daysBack={14} />
        </Box>
      </ScrollView>
    </BaseTekUploadView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
