import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NextButton} from '../components';

export const Start = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();

  const onNext = useCallback(() => navigation.navigate('OnboardingAnonymous'), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Box style={styles.spacer} />
        <Box flex={1} justifyContent="center">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Box flex={1} paddingHorizontal="m">
              <OnboardingHeader
                text={i18n.translate('Onboarding.Start.Title')}
                imageSrc={require('assets/onboarding-start.png')}
                index={1}
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
          <Box borderTopWidth={2} borderTopColor="gray5" paddingVertical="m">
            <NextButton onNext={onNext} />
          </Box>
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
  spacer: {
    marginBottom: 54,
  },
});
