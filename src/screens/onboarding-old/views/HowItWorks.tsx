import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, ButtonSingleLine, BulletPointCheck, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BackButton, NextButton, StepText} from '../components';

export const HowItWorks = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const onNext = useCallback(() => navigation.navigate('OnboardingPermissions'), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton />
        <Box flex={1} justifyContent="center">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Box flex={1} paddingHorizontal="l">
              <OnboardingHeader
                text={i18n.translate('Onboarding.HowItWorks.Title')}
                imageSrc={require('assets/onboarding-howitworks.png')}
                accessible
                accessibilityLabel={i18n.translate('Onboarding.HowItWorks.ImageAltText')}
              />

              <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body1')} />
              <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body2')} />
              <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body3')} />

              <Box alignSelf="stretch" marginTop="m" marginBottom="l">
                <Box>
                  <ButtonSingleLine
                    text={i18n.translate('Onboarding.HowItWorks.HowItWorksCTA')}
                    variant="bigFlatNeutralGrey"
                    internalLink
                    onPress={onLearnMore}
                  />
                </Box>
              </Box>
            </Box>
          </ScrollView>
          <Box height={5} maxHeight={2} borderTopWidth={2} borderTopColor="gray5" />
          <StepText index={4} />
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
