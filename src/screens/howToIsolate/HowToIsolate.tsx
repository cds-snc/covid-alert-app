import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Toolbar, BulletPointCheck, SafeAreaView} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

export const HowToIsolate = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeAreaView>
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
          <BulletPointCheck listAccessibile="listStart" text={i18n.translate('HowToIsolate.Body1')} />
          <BulletPointCheck listAccessibile="item" text={i18n.translate('HowToIsolate.Body2')} />
          <BulletPointCheck listAccessibile="item" text={i18n.translate('HowToIsolate.Body3')} />
          <BulletPointCheck listAccessibile="item" text={i18n.translate('HowToIsolate.Body4')} />
          <BulletPointCheck listAccessibile="listEnd" text={i18n.translate('HowToIsolate.Body5')} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
