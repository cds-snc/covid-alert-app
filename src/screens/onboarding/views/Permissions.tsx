import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, ButtonSingleLine} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

import {OnboardingHeader} from '../components/OnboardingHeader';

export const Permissions = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader
          text={i18n.translate('Onboarding.Permissions.Title')}
          imageSrc={require('assets/onboarding-enable.png')}
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
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
