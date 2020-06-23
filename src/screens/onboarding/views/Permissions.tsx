import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {OnboardingHeader} from '../components/OnboardingHeader';

export const Permissions = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader text={i18n.translate('OnboardingPermissions.Title')} />

        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Body1')}
          </Text>
        </Box>
        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('OnboardingPermissions.Body2')}
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
