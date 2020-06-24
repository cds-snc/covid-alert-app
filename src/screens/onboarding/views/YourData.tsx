import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, BulletPointX} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {OnboardingHeader} from '../components/OnboardingHeader';

export const YourData = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader text={i18n.translate('YourData.Title')} />

        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('YourData.Intro')}
          </Text>
        </Box>
        <BulletPointX text={i18n.translate('YourData.Body1')} />
        <BulletPointX text={i18n.translate('YourData.Body2')} />
        <BulletPointX text={i18n.translate('YourData.Body3')} />
        <BulletPointX text={i18n.translate('YourData.Body4')} />
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('YourData.Body5')}
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
