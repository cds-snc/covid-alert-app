import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Button, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

import {BaseOnboardingView} from '../components/BaseOnboardingView';

export const WhatItsNot = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('OnboardingAnonymous'), [navigation]);

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
      <Button text={i18n.translate('Onboarding.ActionNext')} variant="thinFlat" onPress={onNext} />
    </BaseOnboardingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
