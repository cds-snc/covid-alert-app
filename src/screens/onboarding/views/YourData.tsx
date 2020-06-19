import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Icon} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const YourData = () => {
  const [i18n] = useI18n();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box flex={1} marginTop="xl" paddingHorizontal="xl">
        <Box marginTop="m">
          <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('YourData.Title')}
          </Text>
        </Box>

        <Box flexDirection="row" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body')}
          </Text>
        </Box>
        <Box flexDirection="row" marginBottom="l">
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body1')}
          </Text>
        </Box>
        <Box flexDirection="row" marginBottom="l">
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body2')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="flex-start" marginBottom="l">
          <Text marginTop="s" marginRight="m">
            <Icon size={20} name="icon-x" />
          </Text>
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body3')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body4')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText" marginRight="m">
            {i18n.translate('YourData.Body5')}
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
