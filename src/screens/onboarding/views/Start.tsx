import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Button, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

import {BaseOnboardingView} from '../components/BaseOnboardingView';

export const Start = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();

  const onNext = useCallback(() => navigation.navigate('OnboardingWhatItsNot'), [navigation]);

  return (
    <BaseOnboardingView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Box flex={1} paddingHorizontal="xl">
          <OnboardingHeader
            text={i18n.translate('Onboarding.Start.Title')}
            imageSrc={require('assets/onboarding-start.png')}
            accessible
            accessibilityLabel={i18n.translate('Onboarding.Start.ImageAltText')}
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
      <Box paddingHorizontal="m" alignItems="center" justifyContent="center" flexDirection="row" marginBottom="l">
        <Button text={i18n.translate('Onboarding.ActionNext')} variant="thinFlat" onPress={onNext} />
      </Box>
    </BaseOnboardingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
