import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';
import {ContagiousDateType} from 'shared/DataSharing';

import {BaseTekUploadView, DatePicker, StepXofY} from './components';

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const secondaryButtonOnPress = useCallback(() => navigation.navigate('TekUploadNoDate'), [navigation]);
  const {data, setSymptomOnsetDate} = useContext(FormContext);
  const dateParts = data.symptomOnsetDate.split('-');
  const providedDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.SymptomOnsetDate.CTA')}
      contagiousDateInfo={{dateType: ContagiousDateType.SymptomOnsetDate, date: providedDate}}
      secondaryButtonText={i18n.translate('DataUpload.SymptomOnsetDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
    >
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title1')}
          </Text>
          <DatePicker daysBack={14} selectedDate={data.symptomOnsetDate} setDate={setSymptomOnsetDate} />
          <Text variant="bodyTitle2" marginTop="l" marginBottom="s">
            {i18n.translate('DataUpload.SymptomOnsetDate.Title2')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
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
