import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = () => {
  const [i18n] = useI18n();
  const onActionGuidance = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  const onActionHow = useCallback(() => {
    Linking.openURL(i18n.translate('Home.HowUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
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
        <Button text={i18n.translate('Home.SeeGuidance')} variant="bigFlat" externalLink onPress={onActionGuidance} />
      </Box>
      <Box alignSelf="stretch" marginBottom="s">
        <Button text={i18n.translate('Home.How')} variant="bigFlat" externalLink onPress={onActionHow} />
      </Box>
    </BaseHomeView>
  );
};
