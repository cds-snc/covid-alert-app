import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {BaseTekUploadView, DatePicker} from './components';

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();

  return (
    <BaseTekUploadView buttonText={i18n.translate('DataUpload.SymptomOnsetDate.CTA')}>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="s">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          <DatePicker />
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body2')}</Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body3')}</Text>
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
