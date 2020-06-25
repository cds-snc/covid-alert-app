import React from 'react';
import {Text, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
      </Text>
      <LastCheckedDisplay textDark />
    </BaseHomeView>
  );
};
