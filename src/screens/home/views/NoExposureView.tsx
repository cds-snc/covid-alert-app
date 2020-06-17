import React from 'react';
import {Text, Box, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {Region} from 'shared/Region';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureView = () => {
  const [i18n] = useI18n();
  const {region} = useStorage();

  const isRegionCovered = (region: Region) => {
    const onboardedCovered = ['ON'];
    if (onboardedCovered.indexOf(region) > -1) {
      return true;
    }
    return false;
  };

  let translationKey;
  if (!region) {
    translationKey = 'Home.NoExposureDetectedDetailedNoRegionSet';
  } else if (isRegionCovered(region)) {
    translationKey = 'Home.NoExposureDetectedDetailed';
  } else {
    translationKey = 'Home.NoExposureDetectedDetailedUncoveredRegion';
  }

  return (
    <BaseHomeView animationSource={require('assets/animation/blue-dot.json')}>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" textAlign="center" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected')}
      </Text>
      <Text variant="bodyText" color="bodyText" textAlign="center">
        {i18n.translate(translationKey)}
      </Text>
      <LastCheckedDisplay />
      {/* centering looks off without this, because other screens with animations have a button */}
      <Box height={50} />
    </BaseHomeView>
  );
};
