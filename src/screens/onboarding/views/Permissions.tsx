import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Icon} from 'components';
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
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Body')}
          </Text>
        </Box>
        <Box flexDirection="row" marginBottom="l">
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Body2')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Body3')}
          </Text>
        </Box>
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
