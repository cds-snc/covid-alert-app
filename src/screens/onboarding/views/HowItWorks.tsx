import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, ButtonSingleLine, BulletPointCheck, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

export const HowItWorks = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} paddingHorizontal="xl">
        <OnboardingHeader
          text={i18n.translate('Onboarding.HowItWorks.Title')}
          imageSrc={require('assets/onboarding-howitworks.png')}
          accessible
          accessibilityLabel={i18n.translate('Onboarding.HowItWorks.ImageAltText')}
        />

        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body1')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body2')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body3')} />

        <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
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
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
