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

  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TestDate.CTA')}
      contagiousDateInfo={{dateType: ContagiousDateType.TestDate, dateString: data.testDate}}
      secondaryButtonText={i18n.translate('DataUpload.TestDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
      dateSelected={data.testDate !== ''}
    >
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.TestDate.Title1')}
          </Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.TestDate.Body1')}</Text>
          <DatePicker daysBack={14} setDate={setTestDate} selectedDate={data.testDate} />
          <Text variant="bodyTitle2" marginVertical="l">
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
