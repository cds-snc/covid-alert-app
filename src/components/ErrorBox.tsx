import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {StyleSheet} from 'react-native';

export const ErrorBox = (props: any) => {
  const i18n = useI18n();
  return (
    <Box paddingHorizontal="m" backgroundColor="danger10" {...props} style={{...styles.box}} flex={1}>
      <Text variant="bodyText" style={{...styles.strongText}}>
        {i18n.translate(`Errors.ContentNoConnect.Title`)}
      </Text>
      <Text variant="bodyText" style={{...styles.bodyText}}>
        {i18n.translate(`Errors.ContentNoConnect.Body`)}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  strongText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyText: {
    marginBottom: 5,
  },
  box: {
    borderLeftWidth: 4,
    borderLeftColor: '#CC2934',
    paddingVertical: 5,
    marginBottom: 10,
  },
});
