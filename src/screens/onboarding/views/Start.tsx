import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, BulletPointX, Text, Icon} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {OnboardingHeader} from '../components/OnboardingHeader';

export const Start = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} paddingHorizontal="xl" marginTop="xl">
        <OnboardingHeader text={i18n.translate('OnboardingStart.Title')} />

        <Box flexDirection="row" marginBottom="l">
          <Box marginTop="xxxs">
            <Icon size={20} name="icon-notifications" />
          </Box>
          <Text variant="bodyText" color="overlayBodyText" marginLeft="m" marginRight="m">
            {i18n.translate('OnboardingStart.Body1')}
          </Text>
        </Box>
        <BulletPointX text={i18n.translate('OnboardingStart.Body2')} />

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
        <BulletPointX text={i18n.translate('OnboardingStart.Body4')} />

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
