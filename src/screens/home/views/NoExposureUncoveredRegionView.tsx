import React from 'react';
import {TextMultiline} from 'components';
import {useI18n} from 'locale';
import {useCachedStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';

import {BaseHomeView} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const NoExposureUncoveredRegionView = () => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useCachedStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <BaseHomeView iconName="hand-no-province-yet">
        <AllSetView
          testID="allSetUncoveredRegionView"
          titleText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
          bodyText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.AllSetBody')}
        />
      </BaseHomeView>
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="hand-no-province-yet">
      <HomeScreenTitle testID="uncoveredRegionHeader">
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
      </HomeScreenTitle>
      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Body')}
      />
    </BaseHomeView>
  );
};
