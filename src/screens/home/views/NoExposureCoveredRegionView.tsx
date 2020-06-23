import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text, Box, ButtonMultiline, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();

  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionCoveredTitle')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.RegionCoveredBody')}
      </Text>

      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginTop="s" marginBottom="l">
        <ButtonMultiline
          text={i18n.translate('Home.How')}
          text1={i18n.translate('Home.CTA')}
          variant="bigFlat"
          internalLink
          onPress={onAction}
        />
      </Box>
    </BaseHomeView>
  );
};
