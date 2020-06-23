import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, BulletPointX, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const Permissions = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <Box marginTop="m">
          <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('OnboardingPermissions.Title')}
          </Text>
        </Box>

        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Intro')}
          </Text>
        </Box>

        <BulletPointX text={i18n.translate('OnboardingPermissions.Body1')} />
        <BulletPointX text={i18n.translate('OnboardingPermissions.Body2')} />
        <BulletPointX text={i18n.translate('OnboardingPermissions.Body3')} />
        <BulletPointX text={i18n.translate('OnboardingPermissions.Body4')} />
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
