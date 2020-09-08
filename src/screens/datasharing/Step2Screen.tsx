import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const Step2Screen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onOption1 = useCallback(() => navigation.navigate('SymptomOnsetDate'), [navigation]);
  const onOption2 = useCallback(() => navigation.navigate('TestDate'), [navigation]);
  const onOption3 = useCallback(() => navigation.navigate('TestDate'), [navigation]);
  const onOption4 = useCallback(() => navigation.navigate('TekUploadNoDate'), [navigation]);

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step2.Title')}
          </Text>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step2.Option1')} onPress={onOption1} />
          </Box>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step2.Option2')} onPress={onOption2} />
          </Box>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step2.Option3')} onPress={onOption3} />
          </Box>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step2.Option4')} onPress={onOption4} />
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
