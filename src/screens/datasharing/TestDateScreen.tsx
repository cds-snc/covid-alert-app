import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';

import {BaseTekUploadView, DatePicker, StepXofY} from './components';

export const TestDateScreen = () => {
  const i18n = useI18n();
  const {data} = useContext(FormContext);

  // todo: pass {dateType: 'testDate', dateString: selectedDate}
  const navigation = useNavigation();
  const secondaryButtonOnPress = useCallback(() => navigation.navigate('TekUploadNoDate'), [navigation]);

  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TestDate.CTA')}
      contagiousDateInfo={{dateType: 'testDate', dateString: data.selectedDate}}
      secondaryButtonText={i18n.translate('DataUpload.TestDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
      primaryButtonDisabled={data.selectedDate === ''}
    >
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.TestDate.Title')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.TestDate.Body1')}</Text>
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
