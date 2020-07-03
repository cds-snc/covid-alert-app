import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BackButton, NextButton, StepText} from '../components';

export const WhatItsNot = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('OnboardingAnonymous'), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton />
        <Box flex={1} paddingTop="s" justifyContent="center">
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
          <Box height={5} maxHeight={2} borderTopWidth={2} borderTopColor="gray5" />
          <StepText index={2} />
          <NextButton onNext={onNext} />
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});
