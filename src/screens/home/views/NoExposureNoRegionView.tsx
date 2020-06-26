import React from 'react';
import {Text, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureNoRegionView = () => {
  const [i18n] = useI18n();
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Body')}
      </Text>
      <LastCheckedDisplay textDark />
    </BaseHomeView>
  );
};
