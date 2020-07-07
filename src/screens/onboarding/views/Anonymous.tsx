import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, BulletPointX, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BackButton, NextButton, StepText} from '../components';

export const Anonymous = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('OnboardingWhatItsNot'), [navigation]);
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton />
        <Box flex={1} justifyContent="center">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Box flex={1} paddingHorizontal="l">
              <OnboardingHeader
                text={i18n.translate('Onboarding.Anonymous.Title')}
                imageSrc={require('assets/onboarding-nogps.png')}
                accessible
                accessibilityLabel={i18n.translate('Onboarding.Anonymous.ImageAltText')}
              />

              <Box flexDirection="row" marginBottom="m">
                <Text variant="bodyText" color="overlayBodyText">
                  {i18n.translate('Onboarding.Anonymous.Body1')}
                </Text>
              </Box>
              <Box flexDirection="row" marginBottom="l">
                <Text variant="bodyText" color="overlayBodyText">
                  {i18n.translate('Onboarding.Anonymous.Body2')}
                </Text>
              </Box>

              <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet1')} />
              <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet2')} />
              <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet3')} />
              <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet4')} />
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
