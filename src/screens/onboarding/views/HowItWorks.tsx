import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, ButtonSingleLine, BulletPointCheck, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

export const HowItWorks = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader
          text={i18n.translate('Onboarding.HowItWorks.Title')}
          imageSrc={require('assets/onboarding-howitworks.png')}
        />

        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body1')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body2')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body3')} />

        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText" />
        </Box>

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
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
