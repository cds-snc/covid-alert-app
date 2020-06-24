import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Box, Text, Toolbar} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

export const NoCodeScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  return (
    <>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
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
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
