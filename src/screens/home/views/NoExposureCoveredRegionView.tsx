import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text, Box, Button, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {Theme} from 'shared/theme';

import {BaseHomeView} from '../components/BaseHomeView';

type Color = keyof Theme['colors'];

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();
  const titleTextColor = 'successText';
  const bodyTextColor = 'bodyText';

  const titleColor: Color = titleTextColor as Color;
  const textColor: Color = bodyTextColor as Color;

  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color={titleColor} marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionCoveredTitle')}
      </Text>
      <Text variant="bodyText" color={textColor} marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.RegionCoveredBody')}
      </Text>

      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginBottom="l">
        <Button text={i18n.translate('Home.How')} variant="opaqueGrey" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
