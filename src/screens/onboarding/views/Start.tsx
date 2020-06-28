import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const Start = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} paddingHorizontal="xl" marginTop="xl">
        <OnboardingHeader
          text={i18n.translate('Onboarding.Start.Title')}
          imageSrc={require('assets/onboarding-start.png')}
        />

        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Start.Body1')}
          </Text>
        </Box>
        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Start.Body2')}
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
