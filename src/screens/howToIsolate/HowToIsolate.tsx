import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Toolbar, BulletPointCheck} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const HowToIsolate = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box flex={1}>
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
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
              {i18n.translate('HowToIsolate.Title')}
            </Text>
            <Text fontWeight="bold" marginBottom="l">
              {i18n.translate('HowToIsolate.Intro')}
            </Text>
            <BulletPointCheck text={i18n.translate('HowToIsolate.Body1')} />
            <BulletPointCheck text={i18n.translate('HowToIsolate.Body2')} />
            <BulletPointCheck text={i18n.translate('HowToIsolate.Body3')} />
            <BulletPointCheck text={i18n.translate('HowToIsolate.Body4')} />
            <BulletPointCheck text={i18n.translate('HowToIsolate.Body5')} />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
