import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = () => {
  const [i18n] = useI18n();
  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);
  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyTextNutmeg" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.ExposureDetectedDetailed1')}
      </Text>

      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.ExposureDetectedDetailed2')}
      </Text>

      {/* <LastCheckedDisplay /> */}
      <Box alignSelf="stretch" marginTop="l" marginBottom="s">
        <Button text={i18n.translate('Home.SeeGuidance')} variant="opaqueFlat" externalLink onPress={onAction} />
      </Box>
      <Box alignSelf="stretch">
        <Button text={i18n.translate('Home.How')} variant="opaqueFlat" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
