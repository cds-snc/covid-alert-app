import React from 'react';
import {Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureUncoveredRegionView = () => {
  const [i18n] = useI18n();

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Body')}
      </Text>
    </BaseHomeView>
  );
};
