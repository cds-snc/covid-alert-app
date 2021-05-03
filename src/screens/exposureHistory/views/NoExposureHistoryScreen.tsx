import React from 'react';
import {StyleSheet} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon} from 'components';

export const NoExposureHistoryScreen = () => {
  const i18n = useI18n();

  return (
    <Box style={styles.noExposureHistoryScreen} marginTop="xl">
      <Icon height={120} width={150} name="exposure-history-thumb" />
      <Text paddingTop="s" fontWeight="bold">
        {i18n.translate('ExposureHistory.NoExposures')}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  noExposureHistoryScreen: {
    flex: 1,
    alignItems: 'center',
  },
});
