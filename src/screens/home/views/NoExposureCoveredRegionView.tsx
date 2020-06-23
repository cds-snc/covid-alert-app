import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Text, Box, ButtonMultiline, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();

  const {region} = useStorage();

  const onActionGuidance = useCallback(() => {
    let url = i18n.translate(`RegionalGuidanceURL.CA`);
    if (region !== undefined && region !== 'None') {
      const regionalURL = i18n.translate(`RegionalGuidanceURL.${region}`);
      if (regionalURL !== '') {
        url = regionalURL;
      }
    }
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }, [i18n, region]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
      </Text>

      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginTop="s" marginBottom="l">
        <ButtonMultiline
          text={i18n.translate('Home.NoExposureDetected.RegionCovered.BtnText1')}
          text1={i18n.translate('Home.NoExposureDetected.RegionCovered.BtnText2')}
          variant="bigFlat"
          internalLink
          onPress={onActionGuidance}
        />
      </Box>
    </BaseHomeView>
  );
};
