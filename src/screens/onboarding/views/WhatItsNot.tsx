import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseOnboardingView} from '../components/BaseOnboardingView';

export const WhatItsNot = () => {
  const [i18n] = useI18n();
  return (
    <BaseOnboardingView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Box flex={1} paddingHorizontal="xl">
          <OnboardingHeader
            text={i18n.translate('Onboarding.WhatItsNot.Title')}
            imageSrc={require('assets/onboarding-neighbourhood.png')}
            accessible
            accessibilityLabel={i18n.translate('Onboarding.WhatItsNot.ImageAltText')}
          />

          <Box marginBottom="m">
            <Text variant="bodyText" color="overlayBodyText">
              {i18n.translate('Onboarding.WhatItsNot.Body1')}
            </Text>
          </Box>
          <Box marginBottom="m">
            <Text variant="bodyText" color="overlayBodyText">
              {i18n.translate('Onboarding.WhatItsNot.Body2')}
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </BaseOnboardingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
