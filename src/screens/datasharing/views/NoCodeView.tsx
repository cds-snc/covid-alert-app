import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const NoCodeView = () => {
  const [i18n] = useI18n();

  return (
    <>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('DataUpload.NoCode.Title')}
          </Text>
          <Text variant="bodyText" color="bodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('DataUpload.NoCode.Body')}
          </Text>
        </Box>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
