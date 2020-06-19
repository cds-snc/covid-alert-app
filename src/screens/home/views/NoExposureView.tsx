import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text, Box, Button, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {Theme} from 'shared/theme';

import {BaseHomeView} from '../components/BaseHomeView';

type Color = keyof Theme['colors'];

export const NoExposureView = () => {
  const [i18n] = useI18n();
  const {region} = useStorage();

  const regionCase = getRegionCase(region);

  let titleTextColor = 'bodyTitleWhite';
  let bodyTextColor = 'bodyTextWhite';

  if (regionCase === 'regionCovered') {
    titleTextColor = 'successText';
    bodyTextColor = 'bodyText';
  }

  const titleColor: Color = titleTextColor as Color;
  const textColor: Color = bodyTextColor as Color;

  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.GuidanceUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  const regionTranslationsBody = {
    noRegionSet: 'Home.NoExposureDetected.NoRegionSetBody',
    regionCovered: 'Home.NoExposureDetected.RegionCoveredBody',
    regionNotCovered: 'Home.NoExposureDetected.RegionNotCoveredBody',
  };

  const regionTranslationsTitle = {
    noRegionSet: 'Home.NoExposureDetected.NoRegionSetTitle',
    regionCovered: 'Home.NoExposureDetected.RegionCoveredTitle',
    regionNotCovered: 'Home.NoExposureDetected.RegionNotCoveredTitle',
  };

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color={titleColor} marginBottom="l" accessibilityRole="header">
        {i18n.translate(regionTranslationsTitle[regionCase])}
      </Text>
      <Text variant="bodyText" color={textColor} marginBottom="l">
        {i18n.translate(regionTranslationsBody[regionCase])}
      </Text>

      {regionCase === 'noRegionSet' ? <LastCheckedDisplay /> : <LastCheckedDisplay textDark />}

      <Box alignSelf="stretch" marginTop="l" marginBottom="l">
        <Button text={i18n.translate('Home.How')} variant="opaqueGrey" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
