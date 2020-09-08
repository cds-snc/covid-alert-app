import React, {useState, useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseDataSharingView, DatePicker} from './components';

export const TestDateScreen = () => {
  const i18n = useI18n();
  const [selectedDate, setSelectedDate] = useState('');
  // todo: pass {dateType: 'testDate', dateString: selectedDate}
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('TekUploadWithDate'), [navigation]);

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="s">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          <DatePicker daysBack={14} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body2')}</Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body3')}</Text>
          <Box paddingHorizontal="m" marginBottom="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.SymptomOnsetDate.CTA')} onPress={onNext} />
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
