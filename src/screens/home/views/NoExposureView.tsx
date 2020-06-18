import React from 'react';
import {Text, Box} from 'components';
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

  let regionCase = 'regionNotCovered';
  if (!region) {
    regionCase = 'noRegionSet';
  } else if (isRegionCovered(region)) {
    regionCase = 'regionCovered';
  }

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
      <Text variant="bodyTitle" color="bodyTextNutmeg" marginBottom="l" accessibilityRole="header">
        {i18n.translate(regionTranslationsTitle[regionCase])}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate(regionTranslationsBody[regionCase])}
      </Text>
      {/* <LastCheckedDisplay /> */}
      {/* centering looks off without this, because other screens with animations have a button */}
      <Box height={50} />
    </BaseHomeView>
  );
};
