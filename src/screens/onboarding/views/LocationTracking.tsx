import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, BulletPointX, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {OnboardingHeader} from '../components/OnboardingHeader';

export const LocationTracking = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader text={i18n.translate('OnboardingLocation.Title')} />

        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('OnboardingLocation.Intro')}
          </Text>
        </Box>

        <BulletPointX text={i18n.translate('OnboardingLocation.Body1')} />
        <BulletPointX text={i18n.translate('OnboardingLocation.Body2')} />
        <BulletPointX text={i18n.translate('OnboardingLocation.Body3')} />
        <BulletPointX text={i18n.translate('OnboardingLocation.Body4')} />
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
