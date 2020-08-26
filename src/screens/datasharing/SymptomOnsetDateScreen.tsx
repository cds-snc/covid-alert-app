import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('Home'), [navigation]);
  const [symptomOnsetDate, setSymptomOnsetDate] = useState('');
  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          <Picker selectedValue={symptomOnsetDate} onValueChange={value => setSymptomOnsetDate(value)}>
            <Picker.Item label="Yesterday" value="2020, 7, 20" />
            <Picker.Item label="Wednesday August 19, 2020" value="2020, 7, 19" />
            <Picker.Item label="Tuesday August 18, 2020" value="2020, 7, 18" />
            <Picker.Item label="Monday August 17, 2020" value="2020, 7, 17" />
            <Picker.Item label="Sunday August 16, 2020" value="2020, 7, 16" />
            <Picker.Item label="Saturday August 15, 2020" value="2020, 7, 15" />
            <Picker.Item label="Friday August 14, 2020" value="2020, 7, 14" />
            <Picker.Item label="Thursday August 13, 2020" value="2020, 7, 13" />
            <Picker.Item label="Wednesday August 12, 2020" value="2020, 7, 12" />
            <Picker.Item label="Tuesday August 11, 2020" value="2020, 7, 11" />
            <Picker.Item label="Monday August 10, 2020" value="2020, 7, 10" />
            <Picker.Item label="Sunday August 9, 2020" value="2020, 7, 9" />
            <Picker.Item label="Even earlier" value="2020, 7, 8" />
          </Picker>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body2')}</Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body3')}</Text>
          <Box marginTop="m">
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
