import React from 'react';
import {Box, Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {StyleSheet, Platform} from 'react-native';

export const WhatsNew = () => {
  const i18n = useI18n();

  return Platform.OS === 'ios' ? null : (
    <Box alignSelf="stretch" marginTop="m" style={styles.roundedBox2}>
      <Box paddingHorizontal="m" paddingVertical="m">
        <Text
          variant="bodySubTitle"
          color="bodyText"
          marginBottom="m"
          accessibilityRole="header"
          accessibilityAutoFocus
        >
          {i18n.translate('Home.NoExposureDetected.WhatsNew.Title')}
        </Text>

        <TextMultiline
          variant="bodyText"
          color="bodyText"
          marginBottom="m"
          text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body1')}
        />

        <TextMultiline
          variant="bodyText"
          color="bodyText"
          marginBottom="m"
          text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body2')}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  roundedBox2: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
