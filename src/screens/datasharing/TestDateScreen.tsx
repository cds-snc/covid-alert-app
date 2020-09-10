import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {FormContext} from 'shared/FormContext';

import {BaseDataSharingView, DatePicker, StepXofY} from './components';

export const TestDateScreen = () => {
  const i18n = useI18n();
  const {data} = useContext(FormContext);

  // todo: pass {dateType: 'testDate', dateString: selectedDate}
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('TekUploadWithDate'), [navigation]);

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={3} />
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.TestDate.Title')}
          </Text>
          <Text marginBottom="m">{i18n.translate('DataUpload.TestDate.Body1')}</Text>
          <DatePicker daysBack={14} />
          {!data.modalVisible && (
            <Box marginBottom="m">
              <Button
                disabled={data.selectedDate === ''}
                variant="thinFlat"
                text={i18n.translate('DataUpload.TestDate.CTA')}
                onPress={onNext}
              />
            </Box>
          )}
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
