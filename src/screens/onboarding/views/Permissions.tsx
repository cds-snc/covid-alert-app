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
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <OnboardingHeader text={i18n.translate('OnboardingPermissions.Title')} />
        <Box marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('OnboardingPermissions.Body1')}
          </Text>
        </Box>
        <Box marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('OnboardingPermissions.Body2')}
          </Text>
        </Box>
        <Box alignSelf="stretch" marginTop="m" marginBottom="l">
          <Box marginTop="xxs">
            <ButtonSingleLine
              text={i18n.translate('OnboardingPermissions.PrivacyButtonCTA')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={onPrivacy}
            />
          </Box>
          <Box marginTop="xxs">
            <ButtonSingleLine
              text={i18n.translate('OnboardingPermissions.HowItWorksCTA')}
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
