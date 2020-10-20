import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';
import {ContagiousDateType} from 'shared/DataSharing';

import {BaseTekUploadView, DatePicker, StepXofY} from './components';

export const TestDateScreen = () => {
  const i18n = useI18n();
  const {data, setTestDate} = useContext(FormContext);
  const navigation = useNavigation();
  const secondaryButtonOnPress = useCallback(() => navigation.navigate('TekUploadNoDate'), [navigation]);
  const dateParts = data.testDate.split('-');
  const providedDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TestDate.CTA')}
      contagiousDateInfo={{dateType: ContagiousDateType.TestDate, date: providedDate}}
      secondaryButtonText={i18n.translate('DataUpload.TestDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
    >
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.TestDate.Title1')}
          </Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.TestDate.Body1')}</Text>
          <DatePicker daysBack={14} setDate={setTestDate} selectedDate={data.testDate} />
          <Text variant="bodyTitle2" marginTop="l" marginBottom="s">
            {i18n.translate('DataUpload.TestDate.Title2')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.TestDate.Body2')}</Text>
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
