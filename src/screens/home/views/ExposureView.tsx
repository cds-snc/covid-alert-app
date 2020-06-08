import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box, LastCheckedDisplay} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = () => {
  const [i18n] = useI18n();
  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);
  return (
    <BaseHomeView animationSource={require('assets/animation/blue-and-yellow.json')}>
      <Text textAlign="center" variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" textAlign="center">
        {i18n.translate('Home.ExposureDetectedDetailed')}
      </Text>
      <LastCheckedDisplay />
      <Box alignSelf="stretch" marginTop="l">
        <Button text={i18n.translate('Home.SeeGuidance')} variant="bigFlat" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
