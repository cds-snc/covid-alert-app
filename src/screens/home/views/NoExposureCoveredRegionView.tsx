import React from 'react';
import {TextMultiline, RoundedBox} from 'components';
import {useI18n} from 'locale';
import {useCachedStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {Platform} from 'react-native';

import {AllSetView} from '../components/AllSetView';
import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

const TextContent = () => {
  const i18n = useI18n();

  return (
    <>
      <HomeScreenTitle testID="coveredRegionHeader">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
      </HomeScreenTitle>
      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
      />
    </>
  );
};

export const NoExposureCoveredRegionView = () => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useCachedStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <BaseHomeView iconName="thumbs-up">
        <AllSetView
          testID="allSetCoveredRegionView"
          titleText={i18n.translate('Home.NoExposureDetected.AllSetTitle')}
          bodyText={i18n.translate('Home.NoExposureDetected.RegionCovered.AllSetBody')}
        />
      </BaseHomeView>
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      {Platform.OS === 'ios' ? (
        <TextContent />
      ) : (
        <RoundedBox isFirstBox>
          <TextContent />
        </RoundedBox>
      )}
    </BaseHomeView>
  );
};
