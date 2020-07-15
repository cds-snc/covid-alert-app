import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar, Text} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import Markdown from 'react-native-markdown-display';
import privacyPolicyEn from 'assets/privacypolicy';
import privacyPolicyFr from 'assets/privacypolicy-fr';

export const PrivacyScreen = () => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('Privacy.Close')}
          navLabel={i18n.translate('Privacy.Close')}
          onIconClicked={close}
          accessibilityTitleAutoFocus
        />
        <ScrollView style={styles.flex}>
          <Text
            paddingHorizontal="m"
            variant="bodyTitle"
            color="bodyText"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('Privacy.Title')}
          </Text>
          <Box padding="m">
            <Markdown
              style={{
                body: styles.bodyContent,
              }}
            >
              {i18n.locale === 'en' ? privacyPolicyEn : privacyPolicyFr}
            </Markdown>
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
  bodyContent: {
    fontFamily: 'notosans',
  },
});
