import React from 'react';
import {Text, TextMultiline} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';

import {BaseHomeView} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';

export const NoExposureUncoveredRegionView = () => {
  const [i18n] = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <AllSetView
        titleText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
        bodyText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.AllSetBody')}
      />
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="hand-no-province-yet">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
      </Text>
      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Body')}
      />
    </BaseHomeView>
  );
};
