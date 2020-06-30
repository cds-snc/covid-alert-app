import React from 'react';
import {Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';

import {BaseHomeView} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';

export const NoExposureUncoveredRegionView = () => {
  const [i18n] = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return <AllSetView bodyText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.AllSetBody')} />;
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Body')}
      </Text>
    </BaseHomeView>
  );
};
