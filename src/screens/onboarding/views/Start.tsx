import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, Icon} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

export const Start = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box paddingHorizontal="xl">
        <Box marginTop="m">
          <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('OnboardingStart.Title')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Icon size={20} name="icon-notifications" />
          <Text variant="bodyText" color="overlayBodyText" marginLeft="m" marginRight="m">
            {i18n.translate('OnboardingStart.Body1')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Icon size={20} name="icon-x" />
          <Text variant="bodyText" color="overlayBodyText" marginLeft="m" marginRight="m">
            {i18n.translate('OnboardingStart.Body2')}
          </Text>
        </Box>
        <Box marginTop="m">
          <Text
            variant="bodyTitle"
            color="overlayBodyText"
            marginBottom="l"
            // accessibilityRole="header"
          >
            {i18n.translate('OnboardingStart.Title2')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Icon size={20} name="icon-x" />
          <Text variant="bodyText" color="overlayBodyText" marginLeft="m" marginRight="m">
            {i18n.translate('OnboardingStart.Body4')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Icon size={23} name="icon-no-notifications" />
          <Text variant="bodyText" color="overlayBodyText" marginLeft="m" marginRight="m">
            {i18n.translate('OnboardingStart.Body5')}
          </Text>
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
