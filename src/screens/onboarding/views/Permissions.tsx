import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, ButtonSingleLine, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BackButton, NextButton, StepText} from '../components';

export const Permissions = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();

  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);

  const onNext = useCallback(() => navigation.navigate('OnboardingRegion'), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton />
        <Box flex={1} justifyContent="center">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Box flex={1} paddingHorizontal="m">
              <OnboardingHeader
                text={i18n.translate('Onboarding.Permissions.Title')}
                imageSrc={require('assets/onboarding-enable.png')}
                accessible
                accessibilityLabel={i18n.translate('Onboarding.Permissions.ImageAltText')}
              />
              <Box marginBottom="m">
                <Text variant="bodyText" color="overlayBodyText">
                  {i18n.translate('Onboarding.Permissions.Body1')}
                </Text>
              </Box>
              <Box marginBottom="l">
                <Text variant="bodyText" color="overlayBodyText">
                  {i18n.translate('Onboarding.Permissions.Body2')}
                </Text>
              </Box>
              <Box alignSelf="stretch" marginTop="m" marginBottom="l">
                <Box>
                  <ButtonSingleLine
                    text={i18n.translate('Onboarding.Permissions.PrivacyButtonCTA')}
                    variant="bigFlatNeutralGrey"
                    internalLink
                    onPress={onPrivacy}
                  />
                </Box>
              </Box>
            </Box>
          </ScrollView>
          <Box height={5} maxHeight={2} borderTopWidth={2} borderTopColor="gray5" />
          <StepText index={5} />
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
