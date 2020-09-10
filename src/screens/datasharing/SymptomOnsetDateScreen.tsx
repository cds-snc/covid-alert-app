import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';

import {BaseDataSharingView, DatePicker, StepXofY} from './components';

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();
  // todo: get {dateType: 'symptomOnsetDate', dateString: selectedDate} to the backend service
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('TekUploadWithDate'), [navigation]);
  const {data} = useContext(FormContext);

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          <DatePicker daysBack={14} />
          <Box marginBottom="m">
            {!data.modalVisible && (
              <Button
                disabled={data.selectedDate === ''}
                variant="thinFlat"
                text={i18n.translate('DataUpload.SymptomOnsetDate.CTA')}
                onPress={onNext}
              />
            )}
          </Box>
        </Box>
      </ScrollView>
    </BaseDataSharingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
