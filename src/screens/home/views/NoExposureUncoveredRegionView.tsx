import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text, Box, Button, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureUncoveredRegionView = () => {
  const [i18n] = useI18n();

  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionNotCoveredTitle')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.RegionNotCoveredBody')}
      </Text>

      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginBottom="l">
        <Button text={i18n.translate('Home.How')} variant="bigFlat" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
